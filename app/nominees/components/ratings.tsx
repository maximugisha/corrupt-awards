"use client";

import { Rating } from "@/types/interfaces";

interface NomineeRatingsProps {
  ratings: Rating[];
}

export function NomineeRatings({ ratings }: NomineeRatingsProps) {
  if (!ratings?.length) {
    return <p className="text-red-400">No ratings available</p>;
  }

  return (
    <>
      {ratings.slice(0, 2).map((rating) => (
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
      ))}
    </>
  );
}