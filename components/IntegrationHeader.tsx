"use client";

import { Link2 } from "lucide-react";

export default function IntegrationHeader() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
          <Link2 className="text-blue-600" size={24} />
        </div>

        <div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Google Sheets Integration
          </h1>

          <p className="text-gray-500 mt-1.5 text-base">
            Automatically import leads from your Google Sheets into NRK CRM.
          </p>

        </div>

      </div>

    </div>
  );
}