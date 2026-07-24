"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImportedSheets,deleteImportedSheet, } from "@/lib/api";
import Link from "next/link";

export default function ImportedSheetsPage() {
    const router = useRouter();
    const [sheets, setSheets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check if user is admin
      const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
      const isAdmin = currentUser.role === 'admin' || !currentUser.role;
      
      if (!isAdmin) {
        router.push('/dashboard');
        return;
      }

      const fetchSheets = async () => {
        try {
          const data = await getImportedSheets();
  
          console.log("IMPORTED SHEETS:", data);
  
          setSheets(data.data || []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSheets();

    }, [router]);

    // Get current user to check access
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
    const isAdmin = currentUser.role === 'admin' || !currentUser.role;

    if (!isAdmin) {
      return null; // Will redirect in useEffect
    }
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this imported sheet?"
        );
      
        if (!confirmDelete) return;
      
        try {
          await deleteImportedSheet(id);
      
          setSheets((prev) =>
            prev.filter((sheet) => sheet._id !== id)
          );
        } catch (error) {
          console.error(error);
          alert("Failed to delete sheet.");
        }
      };
    if (loading) {
        return <div className="p-6">Loading...</div>;
      }
      return (
        <div className="w-full p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
          {/* Heading */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Imported Sheets
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              View and manage all your imported Google Sheets.
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
            {sheets.map((sheet) => (
      
              <div
                key={sheet._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
              >
      
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-900 text-lg">
                      {sheet.sheetName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Google Sheet</p>
                  </div>
                </div>
      
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rows</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      {sheet.rows.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Columns</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                      {sheet.headers.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Imported</span>
                    <span className="text-sm text-gray-700 font-medium">
                      {new Date(sheet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/imported-sheets/${sheet._id}`}
                    className="block w-full bg-gradient-to-r from-violet-600 to-violet-700 text-white px-4 py-3 rounded-xl hover:from-violet-700 hover:to-violet-800 transition-all font-semibold text-center shadow-md"
                  >
                    View Sheet
                  </Link>

                  <button
                    onClick={() => handleDelete(sheet._id)}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-all font-semibold border border-red-200"
                  >
                    Delete
                  </button>
                </div>
      
              </div>
      
            ))}
      
          </div>
          
          {sheets.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No imported sheets yet</h3>
              <p className="text-gray-500 text-lg">Import your first Google Sheet from the Integration page.</p>
            </div>
          )}
        </div>
      );
    }