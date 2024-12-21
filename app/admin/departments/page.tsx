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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const response = await axios.get('/api/departments');
    setDepartments(response.data);
  };

  const handleCreateDepartment = async () => {
    await axios.post('/api/departments', newDepartment);
    fetchDepartments();
  };

  const handleUpdateDepartment = async (id: number, data: Partial<Department>) => {
    await axios.put('/api/departments', { id, ...data });
    fetchDepartments();
  };

  const handleDeleteDepartment = async (id: number) => {
    await axios.delete('/api/departments', { data: { departmentId: id } });
    fetchDepartments();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Departments Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create Department</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
          className="mr-2"
        />
        <Button onClick={handleCreateDepartment} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Departments</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="py-2">{department.id}</td>
                <td className="py-2">{department.name}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateDepartment(department.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteDepartment(department.id)} variant="secondary">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default DepartmentsDashboard;