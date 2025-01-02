"use client";

import { AuthGuard } from '@/components/auth-guard';
import NomineeList from './list';

export default function NomineesPage() {
  return (
    <AuthGuard>
      <NomineeList />
    </AuthGuard>
  );
}