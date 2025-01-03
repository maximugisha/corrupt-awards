// components/ratings/RatingComponent.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  examples: string[];
}

interface Rating {
  categoryId: number;
  score: number;
  severity: number;
  evidence: string;
}

interface RatingComponentProps {
  categories: Category[];
  onSubmitRating: (ratings: Rating[]) => Promise<void>;
  type?: 'nominee' | 'institution';
}

export default function RatingComponent({
  categories,
  onSubmitRating,
  type = 'nominee'
}: RatingComponentProps) {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (categoryId: number, score: number) => {
    setRatings(prev => ({
      ...prev,
      [categoryId]: {
        categoryId,
        score,
        severity: Math.ceil(score / 2),
        evidence
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(ratings).length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide at least one rating"
      });
      return;
    }

    if (!evidence.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide evidence for your ratings"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRating(Object.values(ratings));
      
      // Reset form
      setRatings({});
      setEvidence("");
      
      toast({
        title: "Success",
        description: `${type === "nominee" ? "Official" : "Institution"} rated successfully`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit rating"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <Button
                  key={score}
                  type="button"
                  onClick={() => handleRatingChange(category.id, score)}
                  variant={ratings[category.id]?.score === score ? "default" : "outline"}
                  className="p-2"
                >
                  <Star className={`h-6 w-6 ${
                    ratings[category.id]?.score >= score 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`} />
                </Button>
              ))}
            </div>

            {category.examples && category.examples.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                <p className="font-medium">Examples:</p>
                <ul className="list-disc list-inside">
                  {category.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        <div className="space-y-2">
          <label className="block font-medium text-gray-900">
            Evidence
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="mt-1 w-full h-32 p-2 border rounded-md"
              placeholder="Please provide detailed evidence to support your ratings..."
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </form>
    </Card>
  );
}