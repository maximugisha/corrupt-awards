"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RatingCategory } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RatingCategoriesDashboard: React.FC = () => {
  const [ratingCategories, setRatingCategories] = useState<RatingCategory[]>([]);
  const [newRatingCategory, setNewRatingCategory] = useState({ name: '', keyword: '', icon: '', description: '', weight: 0 });

  useEffect(() => {
    fetchRatingCategories();
  }, []);

  const fetchRatingCategories = async () => {
    const response = await axios.get('/api/rating-categories');
    setRatingCategories(response.data);
  };

  const handleCreateRatingCategory = async () => {
    await axios.post('/api/rating-categories', newRatingCategory);
    fetchRatingCategories();
  };

  const handleUpdateRatingCategory = async (id: number, data: Partial<RatingCategory>) => {
    await axios.put('/api/rating-categories', { id, ...data });
    fetchRatingCategories();
  };

  const handleDeleteRatingCategory = async (id: number) => {
    await axios.delete('/api/rating-categories', { data: { ratingCategoryId: id } });
    fetchRatingCategories();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rating Categories Dashboard</h1>
      <Card className="mb-4">
        <h2 className="text-xl font-semibold">Create Rating Category</h2>
        <Input
          type="text"
          placeholder="Name"
          value={newRatingCategory.name}
          onChange={(e) => setNewRatingCategory({ ...newRatingCategory, name: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Keyword"
          value={newRatingCategory.keyword}
          onChange={(e) => setNewRatingCategory({ ...newRatingCategory, keyword: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Icon"
          value={newRatingCategory.icon}
          onChange={(e) => setNewRatingCategory({ ...newRatingCategory, icon: e.target.value })}
          className="mr-2"
        />
        <Input
          type="text"
          placeholder="Description"
          value={newRatingCategory.description}
          onChange={(e) => setNewRatingCategory({ ...newRatingCategory, description: e.target.value })}
          className="mr-2"
        />
        <Input
          type="number"
          placeholder="Weight"
          value={newRatingCategory.weight}
          onChange={(e) => setNewRatingCategory({ ...newRatingCategory, weight: Number(e.target.value) })}
          className="mr-2"
        />
        <Button onClick={handleCreateRatingCategory} className="mt-2">Create</Button>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Rating Categories</h2>
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
            {ratingCategories.map((ratingCategory) => (
              <tr key={ratingCategory.id}>
                <td className="py-2">{ratingCategory.id}</td>
                <td className="py-2">{ratingCategory.name}</td>
                <td className="py-2">{ratingCategory.keyword}</td>
                <td className="py-2">{ratingCategory.icon}</td>
                <td className="py-2">{ratingCategory.description}</td>
                <td className="py-2">{ratingCategory.weight}</td>
                <td className="py-2">
                  <Button onClick={() => handleUpdateRatingCategory(ratingCategory.id, { name: 'Updated Name' })} variant="secondary" className="mr-2">Update</Button>
                  <Button onClick={() => handleDeleteRatingCategory(ratingCategory.id)} variant="secondary">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default RatingCategoriesDashboard;