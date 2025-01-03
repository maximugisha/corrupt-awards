// app/nominees/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import RatingComponent from "@/components/ratings/RatingComponent";
import StatsComponent from "@/components/ratings/StatsComponent";
import {RatingList} from "@/components/ratings/RatingList";
import {CommentSection} from "@/components/ratings/CommentSection";
import { useToast } from "@/components/ui/use-toast";

interface Rating {
  id: number;
  score: number;
  severity: number;
  evidence: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
  ratingCategory: {
    name: string;
    icon: string;
  };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

interface Nominee {
  id: number;
  name: string;
  image?: string;
  position: {
    name: string;
  };
  institution: {
    name: string;
  };
  district: {
    name: string;
  };
  status: boolean;
  evidence?: string;
  rating: Rating[];
  comments: Comment[];
}

interface RatingSubmission {
  ratingCategoryId: number;
  score: number;
  severity: number;
  evidence: string;
}

export default function NomineePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch nominee data
      const nomineeRes = await fetch(`/api/nominees/${params.id}`);
      if (!nomineeRes.ok) throw new Error('Failed to fetch nominee');
      const nomineeData = await nomineeRes.json();
      
      // Fetch rating categories
      const categoriesRes = await fetch('/api/rating-categories/');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesRes.json();
      
      setNominee(nomineeData);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load nominee data"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleRatingSubmit = async (ratings: RatingSubmission[]) => {
    try {
      const response = await fetch(`/api/nominees/${params.id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ratings }),
      });

      if (!response.ok) throw new Error('Failed to submit rating');

      toast({
        title: "Success",
        description: "Rating submitted successfully"
      });

      // Refresh nominee data
      fetchData();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit rating"
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!nominee) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          Nominee not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Nominee Profile Card */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="w-24 h-24">
              <Image
                src={nominee.image || "/placeholder.png"}
                alt={nominee.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{nominee.name}</h1>
              <p className="text-xl text-gray-600">{nominee.position.name}</p>
              <p className="text-gray-500">{nominee.institution.name}</p>
              <Badge variant={nominee.status ? "success" : "warning"}>
                {nominee.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {nominee.evidence && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900">Evidence</h2>
              <p className="text-gray-600">{nominee.evidence}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rating Statistics</h2>
        <StatsComponent
          ratings={nominee.rating}
          categories={categories}
          type="nominee"
        />
      </div>

      {/* Rating Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Rating</h2>
        <RatingComponent
          categories={categories}
          onSubmitRating={handleRatingSubmit}
          type="nominee"
        />
      </div>

      {/* Recent Ratings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Ratings</h2>
        <RatingList ratings={nominee.rating} />
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        <CommentSection
          comments={nominee.comments}
          onAddComment={async (content) => {
            const response = await fetch(`/api/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content,
                userId: 1, // Replace with actual user ID from auth
                nomineeId: nominee.id,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to add comment');
            }

            // Refresh the data
            await fetchData();
          }}
        />
      </div>
    </div>
  );
}