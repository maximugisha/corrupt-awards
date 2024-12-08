"use client";

import React, { useState } from "react";

interface NomineeFormData {
  name: string;
  position: string;
  institution: string;
  district: string;
  status: boolean;
  evidence: File | null;
}

export default function AddNomineeForm() {
  const [formData, setFormData] = useState<NomineeFormData>({
    name: "",
    position: "",
    institution: "",
    district: "",
    status: true,
    evidence: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, evidence: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("institution", formData.institution);
    data.append("district", formData.district);
    data.append("status", formData.status.toString());
    if (formData.evidence) {
      data.append("evidence", formData.evidence);
    }

    try {
      const res = await fetch("/api/admin/nominees", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to add nominee");
      }

      setSuccessMessage("Nominee added successfully!");
      setFormData({
        name: "",
        position: "",
        institution: "",
        district: "",
        status: true,
        evidence: null,
      });
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Nominee</h2>
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Institution</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status.toString()}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Evidence</label>
          <input
            type="file"
            name="evidence"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Add Nominee"}
          </button>
        </div>
      </form>
    </div>
  );
}
