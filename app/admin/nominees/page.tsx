"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Nominee, Position, Institution, District } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NomineesDashboard: React.FC = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [newNominee, setNewNominee] = useState({ name: '', positionId: 0, institutionId: 0, districtId: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNominees(currentPage);
    fetchPositions();
    fetchInstitutions();
    fetchDistricts();
  }, [currentPage]);

  const fetchNominees = async (page: number) => {
    const response = await axios.get(`/api/nominees?page=${page}`);
    setNominees(response.data.data);
    setTotalPages(response.data.pages);
  };

  const fetchPositions = async () => {
    const response = await axios.get('/api/positions');
    setPositions(response.data.data);
  };

  const fetchInstitutions = async () => {
    const response = await axios.get('/api/institutions');
    setInstitutions(response.data.data);
  };

  const fetchDistricts = async () => {
    const response = await axios.get('/api/districts');
    setDistricts(response.data.data);
  };

  const handleCreateNominee = async () => {
    await axios.post('/api/nominees', newNominee);
    fetchNominees(currentPage);
  };

  const handleUpdateNominee = async (id: number, data: Partial<Nominee>) => {
    await axios.put('/api/nominees', { id, ...data });
    fetchNominees(currentPage);
  };

  const handleDeleteNominee = async (id: number) => {
    await axios.delete('/api/nominees', { data: { nomineeId: id } });
    fetchNominees(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nominees Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create Nominee</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newNominee.name}
          onChange={(e) => setNewNominee({ ...newNominee, name: e.target.value })}
          className="mr-2"
        />
        <select
          value={newNominee.positionId}
          onChange={(e) => setNewNominee({ ...newNominee, positionId: Number(e.target.value) })}
          className="mr-2"
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position.id} value={position.id}>{position.name}</option>
          ))}
        </select>
        <select
          value={newNominee.institutionId}
          onChange={(e) => setNewNominee({ ...newNominee, institutionId: Number(e.target.value) })}
          className="mr-2"
        >
          <option value="">Select Institution</option>
          {institutions.map((institution) => (
            <option key={institution.id} value={institution.id}>{institution.name}</option>
          ))}
        </select>
        <select
          value={newNominee.districtId}
          onChange={(e) => setNewNominee({ ...newNominee, districtId: Number(e.target.value) })}
          className="mr-2"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>{district.name}</option>
          ))}
        </select>
        <Button onClick={handleCreateNominee} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Nominees</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Position</th>
              <th className="py-2">Institution</th>
              <th className="py-2">District</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nominees.map((nominee) => (
              <tr key={nominee.id}>
                <td className="py-2">{nominee.id}</td>
                <td className="py-2">{nominee.name}</td>
                <td className="py-2">{positions.find(p => p.id === nominee.positionId)?.name}</td>
                <td className="py-2">{institutions.find(i => i.id === nominee.institutionId)?.name}</td>
                <td className="py-2">{districts.find(d => d.id === nominee.districtId)?.name}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateNominee(nominee.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteNominee(nominee.id)} variant="secondary">Delete</Button>
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

export default NomineesDashboard;