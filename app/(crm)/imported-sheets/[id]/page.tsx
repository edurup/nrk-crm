"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getImportedSheet } from "@/lib/api";

export default function ImportedSheetDetails() {
  const { id } = useParams();

  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const data = await getImportedSheet(id as string);
        setSheet(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSheet();
    }
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!sheet) {
    return <div className="p-6">Sheet not found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {sheet.sheetName}
      </h1>

      <div className="overflow-auto border rounded-xl bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {sheet.headers.map((header: string, index: number) => (
                <th
                  key={index}
                  className="border px-4 py-3 bg-gray-100 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sheet.rows.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="border px-4 py-3"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}