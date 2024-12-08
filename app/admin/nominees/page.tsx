import React from "react";
import AdminLayout from "@/components/AdminLayout";
import NomineeTable from "./NomineeTable";

export default function NomineesAdminPage() {
  return (
    <AdminLayout title="Nominees">
      <NomineeTable />
    </AdminLayout>
  );
}
