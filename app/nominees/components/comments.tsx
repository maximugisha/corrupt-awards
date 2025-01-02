"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Comment } from "@/types/interfaces";
import { formatDate } from "@/lib/utils";

interface NomineeCommentsProps {
  nomineeId: number;
}

export function NomineeComments({ nomineeId }: NomineeCommentsProps) {
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
  );
}