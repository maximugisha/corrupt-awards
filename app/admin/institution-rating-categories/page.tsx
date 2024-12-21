"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InstitutionRatingCategory } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const InstitutionRatingCategoriesDashboard: React.FC = () => {
  const [institutionRatingCategories, setInstitutionRatingCategories] = useState<InstitutionRatingCategory[]>([]);
  const [newInstitutionRatingCategory, setNewInstitutionRatingCategory] = useState({ name: '', keyword: '', icon: '', description: '', weight: 0 });

  useEffect(() => {
    fetchInstitutionRatingCategories();
  }, []);

  const fetchInstitutionRatingCategories = async () => {
    const response = await axios.get('/api/institution-rating-categories');
    setInstitutionRatingCategories(response.data);
  };

  const handleCreateInstitutionRatingCategory = async () => {
    await axios.post('/api/institution-rating-categories', newInstitutionRatingCategory);
    fetchInstitutionRatingCategories();
  };

  const handleUpdateInstitutionRatingCategory = async (id: number, data: Partial<InstitutionRatingCategory>) => {
    await axios.put('/api/institution-rating-categories', { id, ...data });
    fetchInstitutionRatingCategories();
  };

  const handleDeleteInstitutionRatingCategory = async (id: number) => {
    await axios.delete('/api/institution-rating-categories', { data: { institutionRatingCategoryId: id } });
    fetchInstitutionRatingCategories();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Institution Rating Categories Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create Institution Rating Category</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newInstitutionRatingCategory.name}
          onChange={(e) => setNewInstitutionRatingCategory({ ...newInstitutionRatingCategory, name: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Keyword"
          value={newInstitutionRatingCategory.keyword}
          onChange={(e) => setNewInstitutionRatingCategory({ ...newInstitutionRatingCategory, keyword: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Icon"
          value={newInstitutionRatingCategory.icon}
          onChange={(e) => setNewInstitutionRatingCategory({ ...newInstitutionRatingCategory, icon: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Description"
          value={newInstitutionRatingCategory.description}
          onChange={(e) => setNewInstitutionRatingCategory({ ...newInstitutionRatingCategory, description: e.target.value })}
          className="mr-2"
        />
        <Input
          type="number"
          placeholder="Weight"
          value={newInstitutionRatingCategory.weight}
          onChange={(e) => setNewInstitutionRatingCategory({ ...newInstitutionRatingCategory, weight: Number(e.target.value) })}
          className="mr-2"
        />
        <Button onClick={handleCreateInstitutionRatingCategory} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Institution Rating Categories</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Keyword</th>
              <th className="py-2">Icon</th>
              <th className="py-2">Description</th>
              <th className="py-2">Weight</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutionRatingCategories.map((institutionRatingCategory) => (
              <tr key={institutionRatingCategory.id}>
                <td className="py-2">{institutionRatingCategory.id}</td>
                <td className="py-2">{institutionRatingCategory.name}</td>
                <td className="py-2">{institutionRatingCategory.keyword}</td>
                <td className="py-2">{institutionRatingCategory.icon}</td>
                <td className="py-2">{institutionRatingCategory.description}</td>
                <td className="py-2">{institutionRatingCategory.weight}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateInstitutionRatingCategory(institutionRatingCategory.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteInstitutionRatingCategory(institutionRatingCategory.id)} variant="secondary">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default InstitutionRatingCategoriesDashboard;