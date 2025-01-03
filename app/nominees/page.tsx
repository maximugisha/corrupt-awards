"use client";
import React, { useEffect, useState } from "react";
import { Nominee, NomineeResponse, Rating, Comment } from "@/types/interfaces";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AuthGuard } from '@/components/auth-guard';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

  if (now.getTime() - date.getTime() > oneWeekInMs) {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const NomineeComments: React.FC<{ nomineeId: number }> = ({ nomineeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/?nomineeId=${nomineeId}`);
        const data = await response.json();
        setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [nomineeId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch("/api/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomineeId,
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
    <AuthGuard>
    <div className="space-y-3">
      <h3 className="font-medium text-green-400">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 p-3 rounded text-sm flex items-start gap-3"
          >
            <Avatar className="w-8 h-8">
              <Image
                src={comment.user?.image || "/npp.png"}
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
    </AuthGuard>
  );
};

const NomineeList: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [meta, setMeta] = useState<{
    count: number;
    pages: number;
    currentPage: number;
  }>({ count: 0, pages: 0, currentPage: 0 });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      try {
        const nomineesData = await fetchNominees();
        setNominees(nomineesData.data);
        setMeta({
          count: nomineesData.count,
          pages: nomineesData.pages,
          currentPage: nomineesData.currentPage,
        });
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchNominees = async (): Promise<NomineeResponse> => {
    const response = await fetch(`/api/nominees/`);
    return response.json();
  };

  const renderNomineeRating = (ratings: Rating[]) => {
    if (!ratings?.length)
      return <p className={"text-red-400"}>No ratings available</p>;

    return ratings.slice(0, 2).map((rating) => (
      <div key={rating.id} className="border-t pt-2 mt-2">
        <div className="font-medium text-purple-400">
          {rating.ratingCategory.name}
        </div>
        <div className="text-sm text-gray-600">
          <p>Weight: {rating.ratingCategory.weight}%</p>
          <p>Score: {rating.score}/5</p>
        </div>
        <p className="text-sm mt-1 text-gray-500">
          {rating.ratingCategory.description}
        </p>
        <p className="text-sm mt-1 text-black">Evidence:</p>
        <div className="text-sm text-blue-400">
          {rating.evidence || "None provided"}
        </div>
      </div>
    ));
  };

  const filteredNominees = nominees.filter((nominee) =>
    nominee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl text-gray-600 font-bold mb-6">Nominees</h1>
          <div className="mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nominees..."
              className="w-full p-4 rounded-lg border border-gray-300 text-black"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNominees.map((nominee) => (
              <Card key={nominee.id} className="p-6 relative">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <Image
                      src={nominee.image ? nominee.image : "/npp.png"}
                      alt={nominee.name}
                      width={96}
                      height={96}
                    />
                  </Avatar>
                  <h2 className="text-xl text-cyan-700 font-semibold mb-2">
                    <Link
                      href={`/nominees/${nominee.id}`}
                      className="hover:underline"
                    >
                      {nominee.name}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {nominee.position.name} at {nominee.institution.name}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-black mb-2">
                      Recent Ratings
                    </h3>
                    {renderNomineeRating(nominee.rating)}
                  </div>

                  <NomineeComments nomineeId={nominee.id} />
                </div>

                <Link
                  href={`/nominees/${nominee.id}/rate`}
                  className="absolute top-4 right-4 bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-cyan-800 transition"
                >
                  Rate
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NomineeList;
