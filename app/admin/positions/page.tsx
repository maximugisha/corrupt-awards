"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Position } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PositionsDashboard: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPosition, setNewPosition] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPositions(currentPage);
  }, [currentPage]);

  const fetchPositions = async (page: number) => {
    const response = await axios.get(`/api/positions?page=${page}`);
    setPositions(response.data.data);
    setTotalPages(response.data.pages);
  };

  const handleCreatePosition = async () => {
    await axios.post('/api/positions', newPosition);
    fetchPositions(currentPage);
  };

  const handleUpdatePosition = async (id: number, data: Partial<Position>) => {
    await axios.put('/api/positions', { id, ...data });
    fetchPositions(currentPage);
  };

  const handleDeletePosition = async (id: number) => {
    await axios.delete('/api/positions', { data: { positionId: id } });
    fetchPositions(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Positions Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl text-black font-semibold">Create Position</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newPosition.name}
          onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
          className="mr-2 text-black"
        />
        <Button onClick={handleCreatePosition} className="mt-2 bg-black text-white">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl text-black font-semibold">Positions</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black text-left">ID</th>
              <th className="py-2 text-black text-left">Name</th>
              <th className="py-2 text-black text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id}>
                <td className="py-2 text-black text-left">{position.id}</td>
                <td className="py-2 text-black text-left">{position.name}</td>
                <td className="py-2 text-black text-left">
                  <Button onClick={() => handleUpdatePosition(position.id, { name: 'Updated Name' })} variant="secondary" className="mr-2 bg-black text-white">Update</Button>
                  <Button onClick={() => handleDeletePosition(position.id)} variant="secondary" className="bg-black text-white">Delete</Button>
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

export default PositionsDashboard;