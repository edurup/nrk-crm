"use client";
import StatsCards from "@/components/StatsCards";
import LeadTabs from "@/components/LeadTabs";
import LeadToolbar from "@/components/LeadToolbar";
import LeadDetailsDrawer from "@/components/LeadDetailsDrawer";
import AddLeadModal from "@/components/AddLeadModal";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/api";
import LeadTable from "@/components/LeadTable";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [search, setSearch] = useState("");
const [source, setSource] = useState("all");
const [status, setStatus] = useState("all");
const [assignedTo, setAssignedTo] = useState("all");
const [selectedLead, setSelectedLead] = useState<any>(null);
const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();

        setLeads(data.data || []);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  const filteredLeads = leads.filter((lead) => {

    // Search
    const matchesSearch =
      lead.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phoneNumber || lead.phone || "")
        .toLowerCase()
        .includes(search.toLowerCase());
  
    // Tabs
    const matchesTab =
      selectedTab === "all"
        ? true
        : selectedTab === "New Lead"
        ? lead.status === "New Lead" || lead.status === "pending"
        : lead.status === selectedTab;
  
    // Source
    const matchesSource =
  source === "all"
    ? true
    : lead.leadType === source;
  
    // Status dropdown
    const matchesStatus =
      status === "all"
        ? true
        : lead.status === status;
  
    // Assigned To
    const matchesAssigned =
      assignedTo === "all"
        ? true
        : lead.assignedTo === assignedTo;
  
    return (
      matchesSearch &&
      matchesTab &&
      matchesSource &&
      matchesStatus &&
      matchesAssigned
    );
  
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
    Leads
  </h1>

  <p className="text-gray-500 mt-2 text-lg">
    Manage, assign and track all your leads.
  </p>
</div>

<LeadToolbar
  search={search}
  setSearch={setSearch}
  source={source}
  setSource={setSource}
  status={status}
  setStatus={setStatus}
  assignedTo={assignedTo}
  setAssignedTo={setAssignedTo}
  onAddLead={() => setShowAddLead(true)}
/>

      <StatsCards leads={leads} />

<LeadTabs
  leads={leads}
  selected={selectedTab}
  setSelected={setSelectedTab}
/>

<div className="flex gap-6 items-start">

  <div className="flex-1 min-w-0">
    {filteredLeads.length === 0 ? (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
        <p className="text-gray-500">Try adjusting your filters or add a new lead to get started.</p>
      </div>
    ) : (
      <LeadTable
        leads={filteredLeads}
        setLeads={setLeads}
        setSelectedLead={setSelectedLead}
        selectedLead={selectedLead}
      />
    )}
  </div>

  {
  showAddLead && (
    <AddLeadModal
      setLeads={setLeads}
      onClose={() => setShowAddLead(false)}
    />
  )
}

  <div className="w-[360px] shrink-0 sticky top-6 hidden lg:block">
    <LeadDetailsDrawer
      lead={selectedLead}
    />
  </div>

</div>
    </div>
  );
}