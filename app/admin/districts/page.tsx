"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { District } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DistrictsDashboard: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [newDistrict, setNewDistrict] = useState({ name: '', region: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDistricts(currentPage);
  }, [currentPage]);

  const fetchDistricts = async (page: number) => {
    const response = await axios.get(`/api/districts?page=${page}`);
    setDistricts(response.data.data);
    setTotalPages(response.data.pages);
  };

  const handleCreateDistrict = async () => {
    await axios.post('/api/districts', newDistrict);
    fetchDistricts(currentPage);
  };

  const handleUpdateDistrict = async (id: number, data: Partial<District>) => {
    await axios.put('/api/districts', { id, ...data });
    fetchDistricts(currentPage);
  };

  const handleDeleteDistrict = async (id: number) => {
    await axios.delete('/api/districts', { data: { districtId: id } });
    fetchDistricts(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Districts Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create District</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newDistrict.name}
          onChange={(e) => setNewDistrict({ ...newDistrict, name: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Region"
          value={newDistrict.region}
          onChange={(e) => setNewDistrict({ ...newDistrict, region: e.target.value })}
          className="mr-2"
        />
        <Button onClick={handleCreateDistrict} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Districts</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Region</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district) => (
              <tr key={district.id}>
                <td className="py-2">{district.id}</td>
                <td className="py-2">{district.name}</td>
                <td className="py-2">{district.region}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateDistrict(district.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteDistrict(district.id)} variant="secondary">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </Card>
    </div>
  );
};

export default DistrictsDashboard;