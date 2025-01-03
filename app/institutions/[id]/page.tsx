"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import RatingComponent from "@/components/ratings/RatingComponent";
import { RatingList } from "@/components/ratings/RatingList";
import { CommentSection } from "@/components/ratings/CommentSection";
import StatsComponent from "@/components/ratings/StatsComponent";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Rating, Comment, Nominee } from '@/types/interfaces';

interface RatingSubmission {
 categoryId: number;
 score: number;
 severity: number;
 evidence: string;
}

interface InstitutionDetails {
 id: number;
 name: string;
 image?: string;
 status: boolean;
 nominees?: Nominee[];
 rating: Rating[];
 comments?: Comment[];
 createdAt: string;
}

export default function InstitutionPage() {
 const params = useParams();
 const { toast } = useToast();
 const [institution, setInstitution] = useState<InstitutionDetails | null>(null);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);

 const fetchData = useCallback(async () => {
   try {
     const institutionRes = await fetch(`/api/institutions/${params.id}`);
     if (!institutionRes.ok) throw new Error('Failed to fetch institution');
     const institutionData = await institutionRes.json();
     
     const categoriesRes = await fetch('/api/institution-rating-categories/');
     if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
     const categoriesData = await categoriesRes.json();
     
     setInstitution(institutionData);
     setCategories(categoriesData.data);
   } catch (error) {
     console.error('Error fetching data:', error);
     toast({
       variant: "destructive",
       title: "Error",
       description: "Failed to load institution data"
     });
   } finally {
     setLoading(false);
   }
 }, [params.id, toast]);

 useEffect(() => {
   fetchData();
 }, [fetchData]);

 const handleRatingSubmit = async (ratings: RatingSubmission[]) => {
   try {
     const response = await fetch(`/api/institutions/${params.id}/rate`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ ratings }),
     });

     if (!response.ok) throw new Error('Failed to submit rating');

     toast({
       title: "Success",
       description: "Rating submitted successfully"
     });

     fetchData();
   } catch (error) {
     console.error('Error submitting rating:', error);
     toast({
       variant: "destructive",
       title: "Error",
       description: "Failed to submit rating"
     });
   }
 };

 if (loading) {
   return (
     <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="animate-pulse space-y-4">
         <div className="h-32 bg-gray-200 rounded-lg"></div>
         <div className="h-64 bg-gray-200 rounded-lg"></div>
       </div>
     </div>
   );
 }

 if (!institution) {
   return (
     <div className="max-w-7xl mx-auto px-4 py-8">
       <div className="bg-red-100 text-red-800 p-4 rounded-lg">
         Institution not found
       </div>
     </div>
   );
 }

 const averageRating = institution.rating.length 
   ? institution.rating.reduce((acc, r) => acc + r.score, 0) / institution.rating.length
   : 0;

 return (
   <div className="max-w-7xl mx-auto px-4 py-8">
     <Card className="mb-8">
       <CardHeader className="flex flex-row items-start justify-between">
         <div className="flex items-start space-x-4">
           <Avatar className="w-24 h-24">
             <Image
               src={institution.image || "/placeholder.png"}
               alt={institution.name}
               width={96}
               height={96}
               className="object-cover"
             />
           </Avatar>
           <div>
             <h1 className="text-3xl font-bold text-gray-900">{institution.name}</h1>
             <div className="mt-2 space-y-1">
               <Badge variant={institution.status ? "success" : "warning"}>
                 {institution.status ? "Active" : "Inactive"}
               </Badge>
               <div className="flex items-center gap-2 text-gray-600">
                 <Users className="w-4 h-4" />
                 <span>{institution.nominees?.length || 0} Officials</span>
               </div>
             </div>
           </div>
         </div>
         <div className="text-right">
           <div className="text-3xl font-bold text-blue-600">
             {averageRating.toFixed(1)}/5
           </div>
           <p className="text-gray-500">
             {institution.rating.length} ratings
           </p>
         </div>
       </CardHeader>
     </Card>

     <div className="mb-8">
       <h2 className="text-2xl font-bold text-gray-900 mb-4">Rating Statistics</h2>
       <StatsComponent
         ratings={institution.rating}
         categories={categories}
         type="institution"
       />
     </div>

     {institution?.nominees && institution.nominees.length > 0 && (
       <Card className="mb-8">
         <CardContent className="pt-6">
           <h2 className="text-xl font-bold text-gray-900 mb-4">Officials</h2>
           <div className="space-y-4">
             {institution.nominees.map((nominee) => (
               <Link
                 key={nominee.id}
                 href={`/nominees/${nominee.id}`}
                 className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
               >
                 <div>
                   <h3 className="font-medium text-gray-900">{nominee.name}</h3>
                   <p className="text-gray-500">
                     {nominee.position?.name || 'Position not assigned'}
                   </p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-gray-400" />
               </Link>
             ))}
           </div>
         </CardContent>
       </Card>
     )}

     <div className="mb-8">
       <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Rating</h2>
       <RatingComponent
         categories={categories}
         onSubmitRating={handleRatingSubmit}
         type="institution"
       />
     </div>

     <div className="mb-8">
       <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Ratings</h2>
       <RatingList ratings={institution.rating} />
     </div>

     <div className="mb-8">
       <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
       <CommentSection
         comments={institution.comments}
         onAddComment={async (content) => {
           try {
             const response = await fetch(`/api/comments`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 content,
                 userId: 1,
                 institutionId: institution.id,
               }),
             });

             if (!response.ok) {
               throw new Error('Failed to add comment');
             }

             const updatedInstitution = await fetch(`/api/institutions/${params.id}`);
             const data = await updatedInstitution.json();
             setInstitution(data);
           } catch (error) {
             toast({
               variant: "destructive", 
               title: "Error",
               description: "Failed to add comment"
             });
           }
         }}
       />
     </div>
   </div>
 );
}