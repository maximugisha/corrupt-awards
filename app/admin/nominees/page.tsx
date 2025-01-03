"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from 'next/image';
import { Nominee, Position, Institution, District } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface EditNomineeFormData {
  id: number;
  name: string;
  positionId: number;
  institutionId: number;
  districtId: number;
  evidence?: string;
  image?: string;
}

const NomineesDashboard: React.FC = () => {
  const { toast } = useToast();
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNominee, setEditingNominee] = useState<EditNomineeFormData | null>(null);
  const [newNominee, setNewNominee] = useState({
    name: "",
    positionId: 0,
    institutionId: 0,
    districtId: 0,
    evidence: "",
    status: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNominees = useCallback(async (page: number) => {
    try {
      const response = await axios.get(`/api/nominees?page=${page}`);
      setNominees(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching nominees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch nominees",
      });
    }
  }, [toast]);

  // Fetch reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsRes, institutionsRes, districtsRes] = await Promise.all([
          axios.get("/api/positions"),
          axios.get("/api/institutions"),
          axios.get("/api/districts")
        ]);
        setPositions(positionsRes.data.data);
        setInstitutions(institutionsRes.data.data);
        setDistricts(districtsRes.data.data);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch reference data",
        });
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    fetchNominees(currentPage);
  }, [currentPage, fetchNominees]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (editingNominee) {
          setEditingNominee({
            ...editingNominee,
            image: data.url
          });
        } else {
          setNewNominee(prev => ({
            ...prev,
            image: data.url
          }));
        }

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        });
      }
    }
  };

  const handleCreateNominee = async () => {
    try {
      if (!newNominee.name || !newNominee.positionId || !newNominee.institutionId || !newNominee.districtId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      await axios.post("/api/nominees", newNominee);
      fetchNominees(currentPage);
      setNewNominee({
        name: "",
        positionId: 0,
        institutionId: 0,
        districtId: 0,
        evidence: "",
        status: false
      });
      toast({
        title: "Success",
        description: "Nominee created successfully",
      });
    } catch (error) {
      console.error('Error creating nominee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create nominee",
      });
    }
  };

  const handleEditNominee = (nominee: Nominee) => {
    setEditingNominee({
      id: nominee.id,
      name: nominee.name,
      positionId: nominee.positionId,
      institutionId: nominee.institutionId,
      districtId: nominee.districtId,
      evidence: nominee.evidence || '',
      image: nominee.image || undefined
    });
    setEditDialogOpen(true);
  };

  const handleUpdateNominee = async () => {
    if (!editingNominee) return;

    try {
      await axios.patch(`/api/nominees/${editingNominee.id}`, editingNominee);
      fetchNominees(currentPage);
      setEditDialogOpen(false);
      setEditingNominee(null);
      toast({
        title: "Success",
        description: "Nominee updated successfully",
      });
    } catch (error) {
      console.error('Error updating nominee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update nominee",
      });
    }
  };

  const handleToggleStatus = async (nominee: Nominee) => {
    try {
      await axios.patch(`/api/nominees/${nominee.id}`, {
        status: !nominee.status,
      });
      fetchNominees(currentPage);
      toast({
        title: "Success",
        description: `Nominee ${nominee.status ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling nominee status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update nominee status",
      });
    }
  };

  const handleDeleteNominee = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this nominee?")) {
      return;
    }

    try {
      await axios.delete(`/api/nominees/${id}`);
      fetchNominees(currentPage);
      toast({
        title: "Success",
        description: "Nominee deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting nominee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete nominee",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Nominees Dashboard</h1>

      {/* Create Nominee Form */}
      <Card className="p-4 mb-4">
        <h2 className="text-xl text-black font-semibold mb-4">Create Nominee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newNominee.name}
            onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
            className="text-black"
          />
          <select
            value={newNominee.positionId || ""}
            onChange={(e) => setNewNominee({ ...newNominee, positionId: Number(e.target.value) })}
            className="border rounded p-2 text-black"
          >
            <option value="">Select Position</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
          <select
            value={newNominee.institutionId || ""}
            onChange={(e) => setNewNominee({ ...newNominee, institutionId: Number(e.target.value) })}
            className="border rounded p-2 text-black"
          >
            <option value="">Select Institution</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
          <select
            value={newNominee.districtId || ""}
            onChange={(e) => setNewNominee({ ...newNominee, districtId: Number(e.target.value) })}
            className="border rounded p-2 text-black"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-black"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Evidence"
              value={newNominee.evidence}
              onChange={(e) => setNewNominee({ ...newNominee, evidence: e.target.value })}
              className="text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                value={newNominee.status ? "true" : "false"}
                onChange={(e) => setNewNominee(prev => ({
                  ...prev,
                  status: e.target.value === "true"
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="false">Inactive</option>
                <option value="true">Active</option>
              </select>
            </label>
          </div>
        </div>
        <Button
          onClick={handleCreateNominee}
          className="mt-4 bg-blue-600 text-white"
        >
          Create Nominee
        </Button>
      </Card>

      {/* Nominees Table */}
      <Card className="p-4">
        <h2 className="text-xl text-black font-semibold mb-4">Nominees List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Institution</th>
              <th className="px-4 py-2 text-left">District</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
            </thead>
            <tbody>
            {nominees.map((nominee) => (
              <tr key={nominee.id}>
                <td className="px-4 py-2">{nominee.id}</td>
                <td className="px-4 py-2">
                  <div className="relative w-16 h-16">
                    <Image
                      src={nominee.image || "/npp.png"}
                      alt={nominee.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{nominee.name}</td>
                <td className="px-4 py-2">
                  {positions.find((p) => p.id === nominee.positionId)?.name}
                </td>
                <td className="px-4 py-2">
                  {institutions.find((i) => i.id === nominee.institutionId)?.name}
                </td>
                <td className="px-4 py-2">
                  {districts.find((d) => d.id === nominee.districtId)?.name}
                </td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${nominee.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {nominee.status ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-4 py-2">
                  <Button
                    onClick={() => handleEditNominee(nominee)}
                    variant="outline"
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleToggleStatus(nominee)}
                    variant="outline"
                    className={`mr-2 ${nominee.status ? 'bg-red-100' : 'bg-green-100'}`}
                  >
                    {nominee.status ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteNominee(nominee.id)}
                    variant="secondary"
                    className="bg-red-500 hover:bg-red-600 text-white"
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

      {/* Edit Nominee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Nominee</DialogTitle>
            <DialogDescription>
              Make changes to the nominee&apos;s information here.
            </DialogDescription>
          </DialogHeader>

          {editingNominee && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-black">Name</label>
                <Input
                  value={editingNominee.name}
                  onChange={(e) => setEditingNominee({
                    ...editingNominee,
                    name: e.target.value
                  })}
                  className="text-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-black">Position</label>
                <select
                  value={editingNominee.positionId}
                  onChange={(e) => setEditingNominee({
                    ...editingNominee,
                    positionId: Number(e.target.value)
                  })}
                  className="border rounded p-2 text-black"
                >
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-black">Institution</label>
                <select
                  value={editingNominee.institutionId}
                  onChange={(e) => setEditingNominee({
                    ...editingNominee,
                    institutionId: Number(e.target.value)
                  })}
                  className="border rounded p-2 text-black"
                >
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-black">District</label>
                <select
                  value={editingNominee.districtId}
                  onChange={(e) => setEditingNominee({
                    ...editingNominee,
                    districtId: Number(e.target.value)
                  })}
                  className="border rounded p-2 text-black"
                >
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-black">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-black"
                />
                {editingNominee.image && (
                  <div className="relative w-20 h-20 mt-2">
                    <Image
                      src={editingNominee.image}
                      alt="Current nominee image"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-black">Evidence</label>
                <Input
                  value={editingNominee.evidence}
                  onChange={(e) => setEditingNominee({
                    ...editingNominee,
                    evidence: e.target.value
                  })}
                  className="text-black"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNominee} className="bg-blue-600 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NomineesDashboard;