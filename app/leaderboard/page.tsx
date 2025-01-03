"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Medal } from "lucide-react";
import Image from "next/image";
import { AuthGuard } from '@/components/auth-guard';

// Define interfaces if not already imported from @/types/interfaces
interface Rating {
  score: number;
  ratingCategory: {
    name: string;
    weight: number;
  };
}

interface Nominee {
  id: number;
  name: string;
  position: {
    name: string;
  };
  institution: {
    name: string;
  };
  rating: Rating[];
  averageRating?: number;
  image: string;
}

interface Institution {
  id: number;
  name: string;
  rating: Rating[];
  averageRating?: number;
  image: string;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("officials");
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/leaderboard/nominees/").then((res) => res.json()),
      fetch("/api/leaderboard/institutions/").then((res) => res.json()),
    ]).then(([nomineesData, institutionsData]) => {
      setNominees(nomineesData);
      setInstitutions(institutionsData);
      setIsLoading(false);
    });
  }, []);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-gray-300"; // Others
    }
  };

  const RankingItem = ({
    index,
    name,
    rating,
    subtitle,
    avatar,
    imageUrl,
  }: {
    index: number;
    name: string;
    rating: number;
    subtitle?: string;
    avatar?: boolean;
    imageUrl?: string;
  }) => (

    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-8">
        {index <= 2 ? (
          <Medal className={`w-6 h-6 ${getMedalColor(index)}`} />
        ) : (
          <span className="text-lg font-semibold text-gray-500">
            {index + 1}
          </span>
        )}
      </div>

      {avatar && (
        <Avatar className="w-12 h-12">
          <Image
            src={imageUrl || "/pp.jpg"}
            alt={name}
            width={48}
            height={48}
          />
        </Avatar>
      )}

      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="text-right">
        <div className="font-semibold text-cyan-700">{rating.toFixed(2)}</div>
        <div className="text-xs text-gray-500">Average Rating</div>
      </div>
    </div>
  );

  const filteredNominees = nominees.filter((nominee) =>
    nominee.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Corruption Leaderboard
      </h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full p-4 rounded-lg border border-gray-300 text-black"
        />
      </div>

      <div className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("officials")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "officials"
                ? "border-b-2 border-cyan-700 text-cyan-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Officials
          </button>
          <button
            onClick={() => setActiveTab("institutions")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "institutions"
                ? "border-b-2 border-cyan-700 text-cyan-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Institutions
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "officials" ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                {filteredNominees.map((nominee, index) => (
                  <RankingItem
                    key={nominee.id}
                    index={index}
                    name={nominee.name}
                    rating={nominee.averageRating || 0}
                    subtitle={`${nominee.position.name} at ${nominee.institution.name}`}
                    avatar={true}
                    imageUrl={nominee.image}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-4">
                {filteredInstitutions.map((institution, index) => (
                  <RankingItem
                    key={institution.id}
                    index={index}
                    name={institution.name}
                    rating={institution.averageRating || 0}
                    avatar={true}
                    imageUrl={institution.image}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default LeaderboardPage;
