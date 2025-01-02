"use client"; // This ensures the page is treated as a Client Component
import React, { useEffect, useState } from "react";
import { Institution, InstitutionResponse, InstitutionRating, Comment } from "@/types/interfaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem('token');

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const InstitutionComments: React.FC<{ institutionId: number }> = ({ institutionId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/?institutionId=${institutionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }

      });
        const data = await response.json();
        setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [institutionId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch("/api/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json",'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          institutionId,
          content: newComment,
          userId: 1,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-green-400">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded text-sm flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <Image
                src={comment.user?.image || "/pp.jpg"}
                alt={comment.user?.name || "User"}
                width={32}
                height={32}
              />
            </Avatar>
            <div>
              <p className="text-gray-900 font-medium">
                {comment.user?.name || "Unknown User"}
              </p>
              <p className="text-gray-900">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet</p>
      )}
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddComment();
            }
          }}
        />
        <Button onClick={handleAddComment} variant="secondary">
          Post
        </Button>
      </div>
    </div>
  );
};

const InstitutionList: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [meta, setMeta] = useState<{
    count: number;
    pages: number;
    currentPage: number;
  }>({ count: 0, pages: 0, currentPage: 0 });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      try {
        const institutionsData = await fetchInstitutions();
        setInstitutions(institutionsData.data);
        setMeta({
          count: institutionsData.count,
          pages: institutionsData.pages,
          currentPage: institutionsData.currentPage,
        });
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchInstitutions = async (): Promise<InstitutionResponse> => {
    const response = await fetch(`${baseUrl}institutions/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  };

  const renderInstitutionRating = (ratings: InstitutionRating[]) => {
    if (!ratings || ratings.length === 0) {
      return <p>No ratings available</p>;
    }

    const limitedRatings = ratings.slice(0, 2);

    return limitedRatings.map((rating) => (
      <div key={rating.id}>
        <hr />
        <div className={"text-black"}>{rating.ratingCategory.name}</div>
        <p>Weight: {rating.ratingCategory.weight} %</p>
        <p>Score: {rating.score}/5</p>
        <div>Description: {rating.ratingCategory.description}</div>
        <p>Evidence: {rating.evidence || "No evidence provided"}</p>
      </div>
    ));
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl text-gray-600 font-bold">Institutions</h1>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institutions..."
              className="w-full p-4 rounded-lg border border-gray-300 mt-4"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInstitutions.map((institution) => (
              <div key={institution.id} className="bg-white rounded-lg shadow-md p-6 relative">
                <Avatar className="w-24 h-24 mb-4">
                  <Image
                    src={institution.image ? institution.image : "/npp.png"}
                    alt={institution.name}
                    width={96}
                    height={96}
                  />
                </Avatar>
                <h2 className="text-xl text-cyan-700 font-semibold mb-2">
                  <a href={`/institutions/${institution.id}`} className="hover:underline">
                    {institution.name}
                  </a>
                </h2>

                <p className="text-purple-700">Most Recent Corruption Ratings</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div>{renderInstitutionRating(institution.rating)}</div>
                </div>

                <p className="mt-4 text-gray-900">
                  Total Votes: {institution.rating.length}
                </p>

                <a
                  href={`/institutions/${institution.id}/rate`}
                  className="absolute top-4 right-4 bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-cyan-800 transition"
                >
                  Rate
                </a>

                <InstitutionComments institutionId={institution.id} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InstitutionList;