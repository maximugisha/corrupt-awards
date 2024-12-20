"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Institution } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const InstitutionsDashboard: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [newInstitution, setNewInstitution] = useState({ name: '', status: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInstitutions(currentPage);
  }, [currentPage]);

  const fetchInstitutions = async (page: number) => {
    const response = await axios.get(`/api/institutions?page=${page}`);
    setInstitutions(response.data.data);
    setTotalPages(response.data.pages);
  };

  const handleCreateInstitution = async () => {
    await axios.post('/api/institutions', newInstitution);
    fetchInstitutions(currentPage);
  };

  const handleUpdateInstitution = async (id: number, data: Partial<Institution>) => {
    await axios.put('/api/institutions', { id, ...data });
    fetchInstitutions(currentPage);
  };

  const handleDeleteInstitution = async (id: number) => {
    await axios.delete('/api/institutions', { data: { institutionId: id } });
    fetchInstitutions(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Institutions Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl text-black font-semibold">Create Institution</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newInstitution.name}
          onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
          className="mr-2 text-black"
        />
        <Button onClick={handleCreateInstitution} className="mt-2 bg-black text-white">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl text-black font-semibold">Institutions</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black text-left">ID</th>
              <th className="py-2 text-black text-left">Name</th>
              <th className="py-2 text-black text-left">Status</th>
              <th className="py-2 text-black text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td className="py-2 text-black text-left">{institution.id}</td>
                <td className="py-2 text-black text-left">{institution.name}</td>
                <td className="py-2 text-black text-left">{institution.status ? 'Active' : 'Inactive'}</td>
                <td className="py-2 text-black text-left">
                  <Button onClick={() => handleUpdateInstitution(institution.id, { name: 'Updated Name' })} variant="secondary" className="mr-2 bg-black text-white">Update</Button>
                  <Button onClick={() => handleDeleteInstitution(institution.id)} variant="secondary" className="bg-black text-white">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-black text-white">Previous</Button>
          <span className="text-black">Page {currentPage} of {totalPages}</span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-black text-white">Next</Button>
        </div>
      </Card>
    </div>
  );
};

export default InstitutionsDashboard;