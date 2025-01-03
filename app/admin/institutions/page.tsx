// app/admin/institutions/page.tsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Institution {
  id: number;
  name: string;
  image?: string;
  status: boolean;
  createdAt: Date;
  nominees?: { id: number }[];
  rating?: { id: number }[];
}

interface ApiError {
  error: string;
  message?: string;
}

const InstitutionsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [newInstitution, setNewInstitution] = useState({ name: '', status: true });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showInactive, setShowInactive] = useState(false);

  const fetchInstitutions = useCallback(async (page: number) => {
    try {
      const response = await axios.get(`/api/institutions?page=${page}&includeInactive=${showInactive}`);
      setInstitutions(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch institutions",
      });
    }
  }, [showInactive, toast]);

  useEffect(() => {
    fetchInstitutions(currentPage);
  }, [currentPage, fetchInstitutions]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.url;
  };

  const handleCreateInstitution = async () => {
    try {
      if (!newInstitution.name.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter an institution name",
        });
        return;
      }

      let imageUrl = undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await axios.post('/api/institutions', {
        ...newInstitution,
        image: imageUrl
      });

      fetchInstitutions(currentPage);
      setNewInstitution({ name: '', status: true });
      setImageFile(null);
      toast({
        title: "Success",
        description: "Institution created successfully",
      });
    } catch (error) {
      console.error('Error creating institution:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create institution",
      });
    }
  };

  const handleEditInstitution = (institution: Institution) => {
    setEditingInstitution(institution);
    setEditDialogOpen(true);
  };

  const handleUpdateInstitution = async () => {
    if (!editingInstitution) return;

    try {
      let imageUrl = editingInstitution.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await axios.patch(`/api/institutions/${editingInstitution.id}`, {
        name: editingInstitution.name,
        status: editingInstitution.status,
        image: imageUrl
      });

      fetchInstitutions(currentPage);
      setEditDialogOpen(false);
      setEditingInstitution(null);
      setImageFile(null);
      toast({
        title: "Success",
        description: "Institution updated successfully",
      });
    } catch (error) {
      console.error('Error updating institution:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update institution",
      });
    }
  };

  const handleToggleStatus = async (institution: Institution) => {
    try {
      await axios.patch(`/api/institutions/${institution.id}`, {
        status: !institution.status,
      });
      fetchInstitutions(currentPage);
      toast({
        title: "Success",
        description: `Institution ${institution.status ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.error('Error toggling institution status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to update institution status",
      });
    }
  };

  const handleDeleteInstitution = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this institution?")) {
      return;
    }

    try {
      await axios.delete(`/api/institutions/${id}`);
      fetchInstitutions(currentPage);
      toast({
        title: "Success",
        description: "Institution deleted successfully",
      });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.error('Error deleting institution:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to delete institution",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Institutions Dashboard</h1>

      {/* Create Institution Form */}
      <Card className="p-4 mb-4">
        <h2 className="text-xl text-black font-semibold mb-4">Create Institution</h2>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Institution Name"
            value={newInstitution.name}
            onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
            className="text-black"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-black"
          />
        </div>
        <Button
          onClick={handleCreateInstitution}
          className="mt-4 bg-blue-600 text-white"
        >
          Create Institution
        </Button>
      </Card>

      {/* Institutions Table */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-semibold">Institutions List</h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300"
              />
              Show Inactive
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Nominees</th>
              <th className="px-4 py-2 text-left">Ratings</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
            </thead>
            <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td className="px-4 py-2">{institution.id}</td>
                <td className="px-4 py-2">
                  <div className="relative w-16 h-16">
                    <Image
                      src={institution.image || "/placeholder.png"}
                      alt={institution.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{institution.name}</td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${institution.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {institution.status ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-4 py-2">{institution.nominees?.length || 0}</td>
                <td className="px-4 py-2">{institution.rating?.length || 0}</td>
                <td className="px-4 py-2">
                  {new Date(institution.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <Button
                    onClick={() => handleEditInstitution(institution)}
                    variant="outline"
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(institution)}
                    variant="outline"
                    className={`mr-2 ${institution.status ? 'bg-red-100' : 'bg-green-100'}`}
                  >
                    {institution.status ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteInstitution(institution.id)}
                    variant="secondary"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={(institution.nominees?.length ?? 0) > 0 || (institution.rating?.length ?? 0) > 0}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white"
          >
            Previous
          </Button>
          <span className="text-black">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-blue-600 text-white"
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Edit Institution Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Institution</DialogTitle>
            <DialogDescription>
              Make changes to the institution here.
            </DialogDescription>
          </DialogHeader>

          {editingInstitution && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-black">Name</label>
                <Input
                  value={editingInstitution.name}
                  onChange={(e) => setEditingInstitution({
                    ...editingInstitution,
                    name: e.target.value
                  })}
                  className="text-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-black">Image</label>
                {editingInstitution.image && (
                  <div className="relative w-20 h-20 mb-2">
                    <Image
                      src={editingInstitution.image}
                      alt={editingInstitution.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-black">Status</label>
                <select
                  value={editingInstitution.status ? "true" : "false"}
                  onChange={(e) => setEditingInstitution({
                    ...editingInstitution,
                    status: e.target.value === "true"
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingInstitution(null);
                setImageFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateInstitution}
              className="bg-blue-600 text-white"
              disabled={!editingInstitution?.name.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionsDashboard;