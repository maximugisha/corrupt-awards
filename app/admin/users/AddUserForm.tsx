"use client";

import React, { useState } from "react";

export default function AddUserForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    alert("User added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add User
      </button>
    </form>
  );
}
