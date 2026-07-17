"use client";

import { Search, Plus, Upload, Download } from "lucide-react";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  source: string;
  setSource: React.Dispatch<React.SetStateAction<string>>;

  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;

  assignedTo: string;
  setAssignedTo: React.Dispatch<React.SetStateAction<string>>;

  onAddLead: () => void;
}

export default function LeadToolbar({
    search,
    setSearch,
    source,
    setSource,
    status,
    setStatus,
    assignedTo,
    setAssignedTo,
    onAddLead,
  }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Left Side */}
        <div className="flex flex-wrap items-center gap-3 flex-1">

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search leads..."
  className="pl-10 pr-4 py-2.5 w-72 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
/>
          </div>

          {/* Source */}
          <select
  value={source}
  onChange={(e) => setSource(e.target.value)}
  className="px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
>
<option value="all">All Sources</option>
<option value="Request Call">Request Call</option>
<option value="Website Lead">Website Lead</option>
<option value="Download Brochure">Download Brochure</option>
<option value="Admission">Admission</option>
<option value="Free Live Class">Free Live Class</option>
          </select>

          {/* Status */}
          <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
>
<option value="all">All Status</option>
<option value="New Lead">New Lead</option>
<option value="Contacted">Contacted</option>
<option value="Interested">Interested</option>
<option value="Follow-up">Follow-up</option>
<option value="Admission Done">Admission Done</option>
<option value="Not Interested">Not Interested</option>
          </select>

          {/* Assigned */}
          <select
  value={assignedTo}
  onChange={(e) => setAssignedTo(e.target.value)}
  className="px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
>
<option value="all">Assigned To</option>
<option value="Neha Verma">Neha Verma</option>
<option value="Amit Singh">Amit Singh</option>
<option value="Priya Sharma">Priya Sharma</option>
<option value="Rahul Patel">Rahul Patel</option>
          </select>

        </div>

        {/* Right Side */}
        <div className="flex gap-2">

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">
            <Upload size={18} />
            Import
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">
            <Download size={18} />
            Export
          </button>

          <button
  onClick={onAddLead}
  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-medium text-sm shadow-sm hover:shadow-md"
>
  <Plus size={18} />
  Add Lead
</button>

        </div>

      </div>
    </div>
  );
}