"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import IntegrationHeader from "@/components/IntegrationHeader";
import GoogleAccountCard from "@/components/GoogleAccountCard";
import SheetSelector from "@/components/SheetSelector";
import PreviewTable from "@/components/PreviewTable";
import MappingTable from "@/components/MappingTable";

export default function IntegrationsPage() {
  const router = useRouter();
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is admin
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
    const isAdmin = currentUser.role === 'admin' || !currentUser.role;
    
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [router]);

  // Get current user to check access
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
  const isAdmin = currentUser.role === 'admin' || !currentUser.role;

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  console.log("HEADERS IN PAGE:", previewHeaders);

  return (
    <div className="w-full p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Heading */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Google Sheets Integration
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Connect your Google Sheets to import leads automatically.
        </p>
      </div>

      <div className="w-full p-6 space-y-6">

        <IntegrationHeader />

        <GoogleAccountCard />

        <SheetSelector
          setPreviewHeaders={setPreviewHeaders}
          setPreviewRows={setPreviewRows}
        />

        <PreviewTable
          headers={previewHeaders}
          rows={previewRows}
        />

        <MappingTable
          columns={previewHeaders}
        />

      </div>
    </div>
  );
}