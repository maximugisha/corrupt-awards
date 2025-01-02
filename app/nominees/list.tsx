"use client";

import { useEffect, useState } from "react";
import { Nominee, NomineeResponse } from "@/types/interfaces";
import { Input } from "@/components/ui/input";
import { NomineeCard } from "./components/card";
const token = localStorage.getItem('token');


export default function NomineeList() {
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
    const response = await fetch(`/api/nominees/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  };

  const filteredNominees = nominees.filter((nominee) =>
    nominee.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              <NomineeCard key={nominee.id} nominee={nominee} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}