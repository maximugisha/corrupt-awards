"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Department } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DepartmentsDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDepartments(currentPage);
  }, [currentPage]);

  const fetchDepartments = async (page: number) => {
    const response = await axios.get(`/api/departments?page=${page}`);
    setDepartments(response.data.data);
    setTotalPages(response.data.pages);
  };

  const handleCreateDepartment = async () => {
    await axios.post('/api/departments', newDepartment);
    fetchDepartments(currentPage);
  };

  const handleUpdateDepartment = async (id: number, data: Partial<Department>) => {
    await axios.put('/api/departments', { id, ...data });
    fetchDepartments(currentPage);
  };

  const handleDeleteDepartment = async (id: number) => {
    await axios.delete('/api/departments', { data: { departmentId: id } });
    fetchDepartments(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Departments Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl text-black font-semibold">Create Department</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
          className="mr-2 text-black"
        />
        <Button onClick={handleCreateDepartment} className="mt-2 bg-black text-white">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl text-black font-semibold">Departments</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black text-left">ID</th>
              <th className="py-2 text-black text-left">Name</th>
              <th className="py-2 text-black text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="py-2 text-black text-left">{department.id}</td>
                <td className="py-2 text-black text-left">{department.name}</td>
                <td className="py-2 text-black text-left">
                  <Button onClick={() => handleUpdateDepartment(department.id, { name: 'Updated Name' })} variant="secondary" className="mr-2 bg-black text-white">Update</Button>
                  <Button onClick={() => handleDeleteDepartment(department.id)} variant="secondary" className="bg-black text-white">Delete</Button>
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

export default DepartmentsDashboard;