"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

export default function UsersAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <AdminLayout title="Users">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Users Management</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={openModal}
        >
          Create New User
        </button>
      </div>
      <UserTable />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-black">Add New User</h2>
            <AddUserForm />
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
