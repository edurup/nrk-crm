"use client";

import { useEffect, useState } from "react";
import { getImportedSheets,deleteImportedSheet, } from "@/lib/api";
import Link from "next/link";

export default function ImportedSheetsPage() {
    const [sheets, setSheets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
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

    }, []);
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
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Imported Sheets</h1>
      
          <p className="text-gray-500 mt-2">
            View all imported Google Sheets.
          </p>
      
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      
            {sheets.map((sheet) => (
      
              <div
                key={sheet._id}
                className="border rounded-xl p-5 shadow-sm bg-white"
              >
      
                <h2 className="font-semibold text-lg">
                  {sheet.sheetName}
                </h2>
      
                <p className="text-sm text-gray-500 mt-2">
                  Rows: {sheet.rows.length}
                </p>
      
                <p className="text-sm text-gray-500">
                  Columns: {sheet.headers.length}
                </p>
      
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(sheet.createdAt).toLocaleString()}
                </p>

                <Link
  href={`/imported-sheets/${sheet._id}`}
  className="mt-4 inline-block bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
>
  View Sheet
</Link>

<button
  onClick={() => handleDelete(sheet._id)}
  className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
>
  Delete
</button>
      
              </div>
      
            ))}
      
          </div>
        </div>
      );
    }