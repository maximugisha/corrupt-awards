"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted successfully");
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const res = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      alert("User updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      alert("Failed to update user");
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
      <h2 className="text-xl font-semibold mb-4 text-black">User List</h2>
      <DataTable
        columns={["ID", "Name", "Email", "Created At", "Actions"]}
        data={users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          actions: (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          ),
        }))}
      />
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-black">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedUser) handleUpdateUser(selectedUser);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
