// app/institutions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { InstitutionCard } from "./components/InstitutionCard";
import { InstitutionFilter } from "./components/InstitutionFilter";
import { InstitutionSearch } from "./components/InstitutionSearch";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/use-toast";

interface Institution {
  id: number;
  name: string;
  image?: string;
  status: boolean;
  rating: Array<{
    score: number;
  }>;
  nominees?: Array<any>;
}

export default function InstitutionsPage() {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInstitutions();
  }, [searchTerm, filters, currentPage]);

  const fetchInstitutions = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).flatMap(([key, values]) =>
            values.map(value => [key, value])
          )
        )
      });

      const response = await fetch(`/api/institutions?${queryParams}`);
      const data = await response.json();
      
      setInstitutions(data.data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load institutions"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Institutions Directory</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <InstitutionFilter
            selectedFilters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="mb-6">
            <InstitutionSearch
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {institutions.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} />
                ))}
              </div>

              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}