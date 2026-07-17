"use client";

import { useState } from "react";

import IntegrationHeader from "@/components/IntegrationHeader";
import GoogleAccountCard from "@/components/GoogleAccountCard";
import SheetSelector from "@/components/SheetSelector";
import PreviewTable from "@/components/PreviewTable";
import MappingTable from "@/components/MappingTable";

export default function IntegrationsPage() {

  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  console.log("HEADERS IN PAGE:", previewHeaders);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

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
  );
}