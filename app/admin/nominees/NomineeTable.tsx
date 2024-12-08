"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";

interface Nominee {
  id: number;
  name: string;
  position: string;
  institution: string;
  district: string;
  status: boolean;
  evidence: string | null;
  createdAt: string;
}

export default function NomineeTable() {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const res = await fetch("/api/admin/nominees");
        if (!res.ok) {
          throw new Error("Failed to fetch nominees");
        }
        const data: Nominee[] = await res.json();
        setNominees(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNominees();
  }, []);

  const handleDelete = async (nomineeId: number) => {
    if (!confirm("Are you sure you want to delete this nominee?")) return;
    try {
      await fetch(`/api/admin/nominees/${nomineeId}`, {
        method: "DELETE",
      });
      setNominees(nominees.filter((nominee) => nominee.id !== nomineeId));
      alert("Nominee deleted successfully");
    } catch {
      alert("Failed to delete nominee");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Nominee List</h2>
      <DataTable
        columns={[
          "ID",
          "Name",
          "Position",
          "Institution",
          "District",
          "Status",
          "Evidence",
          "Created At",
          "Actions",
        ]}
        data={nominees.map((nominee) => ({
          id: nominee.id,
          name: nominee.name,
          position: nominee.position,
          institution: nominee.institution,
          district: nominee.district,
          status: nominee.status ? "Active" : "Inactive",
          evidence: nominee.evidence || "None",
          createdAt: new Date(nominee.createdAt).toLocaleDateString(),
          actions: (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => alert(`Edit nominee ${nominee.id}`)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(nominee.id)}
              >
                Delete
              </button>
            </div>
          ),
        }))}
      />
    </div>
  );
}
