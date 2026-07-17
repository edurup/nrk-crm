"use client";

import { useEffect, useState } from "react";
import { Database, RefreshCw } from "lucide-react";
import {
  getGoogleSheets,
  getGoogleWorksheets,
  previewGoogleSheet,
  saveGoogleConfiguration,
  getGoogleIntegration,
} from "@/lib/api";

interface SheetSelectorProps {
  setPreviewHeaders: React.Dispatch<React.SetStateAction<string[]>>;
  setPreviewRows: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function SheetSelector({
  setPreviewHeaders,
  setPreviewRows,
}: SheetSelectorProps) {

  const [loading, setLoading] = useState(false);

  const [sheets, setSheets] = useState<any[]>([]);
  const [worksheets, setWorksheets] = useState<any[]>([]);

  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState("");
  const [selectedWorksheet, setSelectedWorksheet] = useState("");

  const loadSheets = async () => {
    try {
      setLoading(true);
  
      const res = await getGoogleSheets();
  
      setSheets(res.data);
  
      return res.data;
  
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const initialize = async () => {
  
      await loadSheets();
  
      try {
  
        const integration =
          await getGoogleIntegration();
  
        if (!integration.data) return;
  
        const savedSpreadsheet =
          integration.data.spreadsheetId;
  
        const savedWorksheet =
          integration.data.worksheetName;
  
        if (!savedSpreadsheet || !savedWorksheet)
          return;
  
        setSelectedSpreadsheet(savedSpreadsheet);
  
        const worksheets =
          await getGoogleWorksheets(
            savedSpreadsheet
          );
  
        setWorksheets(worksheets.data);
  
        setSelectedWorksheet(savedWorksheet);
  
        const preview =
          await previewGoogleSheet(
            savedSpreadsheet,
            savedWorksheet
          );
  
        setPreviewHeaders(preview.headers);
        setPreviewRows(preview.rows);
  
      } catch (error) {
  
        console.log(error);
  
      }
  
    };
  
    initialize();
  
  }, []);

  const handleSpreadsheetChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const spreadsheetId = e.target.value;

    setSelectedSpreadsheet(spreadsheetId);
    setSelectedWorksheet("");

    try {

      const res = await getGoogleWorksheets(
        spreadsheetId
      );

      setWorksheets(res.data);

    } catch (error) {
      console.log(error);
    }

  };
  const handleWorksheetChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
  
    const worksheet = e.target.value;

setSelectedWorksheet(worksheet);

try {

  const selectedSheet = sheets.find(
    (sheet) => sheet.id === selectedSpreadsheet
  );

  await saveGoogleConfiguration({
    spreadsheetId: selectedSpreadsheet,
    spreadsheetName: selectedSheet?.name || "",
    worksheetName: worksheet,
  });

  const res = await previewGoogleSheet(
    selectedSpreadsheet,
    worksheet
  );

  console.log("PREVIEW RESPONSE:", res);

  setPreviewHeaders(res.headers);
  setPreviewRows(res.rows);

} catch (error) {
  console.log(error);
}
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Select Google Sheet
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Choose the spreadsheet and worksheet to import leads from.
          </p>
        </div>

        <button
          onClick={loadSheets}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block text-sm font-medium mb-2 text-gray-700">
            Spreadsheet
          </label>

          <select
            value={selectedSpreadsheet}
            onChange={handleSpreadsheetChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all bg-white"
          >

            <option value="">
              {loading ? "Loading..." : "Select Spreadsheet"}
            </option>

            {sheets.map((sheet: any) => (

              <option
                key={sheet.id}
                value={sheet.id}
              >
                {sheet.name}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium mb-2 text-gray-700">
            Worksheet
          </label>

          <select
  value={selectedWorksheet}
  onChange={handleWorksheetChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all bg-white"
>

            <option value="">
              Select Worksheet
            </option>

            {worksheets.map((sheet: any) => (

              <option
                key={sheet.sheetId}
                value={sheet.title}
              >
                {sheet.title}
              </option>

            ))}

          </select>

        </div>

      </div>

      <div className="mt-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 flex items-center gap-3 shadow-sm">

        <Database className="text-green-700" size={20} />

        <div>

          <p className="font-medium text-green-800">
            Ready to Import
          </p>

          <p className="text-sm text-green-700">
            Once connected, you'll be able to preview rows before importing.
          </p>

        </div>

      </div>

    </div>
  );
}