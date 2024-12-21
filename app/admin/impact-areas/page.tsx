"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImpactArea } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ImpactAreasDashboard: React.FC = () => {
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>([]);
  const [newImpactArea, setNewImpactArea] = useState({ name: '' });

  useEffect(() => {
    fetchImpactAreas();
  }, []);

  const fetchImpactAreas = async () => {
    const response = await axios.get('/api/impact-areas');
    setImpactAreas(response.data);
  };

  const handleCreateImpactArea = async () => {
    await axios.post('/api/impact-areas', newImpactArea);
    fetchImpactAreas();
  };

  const handleUpdateImpactArea = async (id: number, data: Partial<ImpactArea>) => {
    await axios.put('/api/impact-areas', { id, ...data });
    fetchImpactAreas();
  };

  const handleDeleteImpactArea = async (id: number) => {
    await axios.delete('/api/impact-areas', { data: { impactAreaId: id } });
    fetchImpactAreas();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Impact Areas Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create Impact Area</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newImpactArea.name}
          onChange={(e) => setNewImpactArea({ ...newImpactArea, name: e.target.value })}
          className="mr-2"
        />
        <Button onClick={handleCreateImpactArea} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Impact Areas</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {impactAreas.map((impactArea) => (
              <tr key={impactArea.id}>
                <td className="py-2">{impactArea.id}</td>
                <td className="py-2">{impactArea.name}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateImpactArea(impactArea.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteImpactArea(impactArea.id)} variant="secondary">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ImpactAreasDashboard;