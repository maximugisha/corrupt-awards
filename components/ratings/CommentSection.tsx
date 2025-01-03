// components/ratings/CommentSection.tsx
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Comment } from "@/types/interfaces";  // Import the global Comment interface

interface CommentSectionProps {
  comments?: Comment[];  // Make comments optional
  onAddComment: (content: string) => Promise<void>;
}

export function CommentSection({ 
  comments = [],  // Provide default empty array
  onAddComment 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          Post
        </Button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex space-x-4">
              <Avatar className="w-10 h-10">
                <Image
                  src={comment.user?.image || "/placeholder-avatar.png"}
                  alt={comment.user?.name || "Anonymous User"}
                  width={40}
                  height={40}
                />
              </Avatar>
              <div>
                <div className="flex items-baseline space-x-2">
                  <h4 className="font-medium">
                    {comment.user?.name || "Anonymous User"}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { 
                      addSuffix: true 
                    })}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}