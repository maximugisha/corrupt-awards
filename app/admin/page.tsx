"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface ModelData {
  name: string;
  count: number;
}

export default function AdminHomepage() {
  const [modelsData, setModelsData] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelsData = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        if (!res.ok) {
          throw new Error("Failed to fetch model data");
        }
        const data: ModelData[] = await res.json();
        setModelsData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <header className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white text-xl font-bold">
        Admin Dashboard
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {modelsData.map((model) => (
          <Link href={`/admin/${model.name.toLowerCase()}`} legacyBehavior key={model.name}>
            <div className="p-4 border rounded-lg shadow-md bg-white hover:bg-gray-100 transition-colors duration-300">
              <h3 className="text-xl font-semibold text-gray-500">{model.name}</h3>
              <p className="text-lg text-cyan-500">{model.count} entries</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}