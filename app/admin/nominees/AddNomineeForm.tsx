"use client";

import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

export default function AddNomineeForm() {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    institution: "",
    district: "",
    status: true,
    evidence: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [positions, setPositions] = useState<Option[]>([]);
  const [institutions, setInstitutions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const positionsRes = await fetch("/api/positions");
        const institutionsRes = await fetch("/api/institutions");
        const districtsRes = await fetch("/api/districts");

        if (!positionsRes.ok || !institutionsRes.ok || !districtsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const positionsData = await positionsRes.json();
        const institutionsData = await institutionsRes.json();
        const districtsData = await districtsRes.json();

        // Ensure positionsData, institutionsData, and districtsData have the correct structure
        if (
          positionsData.hasOwnProperty("data") &&
          Array.isArray(positionsData.data) &&
          institutionsData.hasOwnProperty("data") &&
          Array.isArray(institutionsData.data) &&
          districtsData.hasOwnProperty("data") &&
          Array.isArray(districtsData.data)
        ) {
          setPositions(
            positionsData.data.map(
              (position: { id: number; name: string }) => ({
                value: position.id,
                label: position.name,
              }),
            ),
          );
          setInstitutions(
            institutionsData.data.map(
              (institution: { id: number; name: string }) => ({
                value: institution.id,
                label: institution.name,
              }),
            ),
          );
          setDistricts(
            districtsData.data.map(
              (district: { id: number; name: string }) => ({
                value: district.id,
                label: district.name,
              }),
            ),
          );
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setErrorMessage((err as Error).message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
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
        evidence: "",
      });
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* <h2 className="text-xl font-semibold mb-4">Add New Nominee</h2> */}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Position
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="" disabled>
              Select ...
            </option>
            {positions.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Institution
          </label>
          <select
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="" disabled>
              Select ...
            </option>
            {institutions.map((institution) => (
              <option key={institution.value} value={institution.value}>
                {institution.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            District
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="" disabled>
              Select ...
            </option>
            {districts.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Status
          </label>
          <select
            name="status"
            value={formData.status.toString()}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Evidence
          </label>
          <input
            type="text"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-black"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 text-black rounded ${
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
