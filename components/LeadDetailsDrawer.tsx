"use client";

import {
  Phone,
  Mail,
  MessageCircle,
  GraduationCap,
  User,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Save,
  Edit2,
} from "lucide-react";
import { useState } from "react";
import { updateLeadNotes } from "@/lib/api";

interface Props {
  lead: any;
  setLeads?: React.Dispatch<React.SetStateAction<any[]>>;
}

const statusColors: Record<string, string> = {
  "New Lead": "bg-blue-100 text-blue-700",
  Contacted: "bg-indigo-100 text-indigo-700",
  Interested: "bg-green-100 text-green-700",
  "Follow-up": "bg-yellow-100 text-yellow-700",
  "Admission Done": "bg-emerald-100 text-emerald-700",
  "Not Interested": "bg-red-100 text-red-700",
  "Free Classes Registered": "bg-purple-100 text-purple-700",
  "Demo Attended": "bg-orange-100 text-orange-700",
};

export default function LeadDetailsDrawer({ lead, setLeads }: Props) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(lead?.leadNotes || "");
  const [saving, setSaving] = useState(false);

  if (!lead) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-400 sticky top-6">
        Select a lead to view details
      </div>
    );
  }

  const initials = lead.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6 overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-200">

        <div className="flex gap-4">

          <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-700 font-bold text-xl flex items-center justify-center shadow-sm">
            {initials}
          </div>

          <div className="flex-1">

            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  {lead.fullName}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {lead.phoneNumber || lead.phone}
                </p>

                <p className="text-sm text-gray-500">
                  {lead.email}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[lead.status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {lead.status}
              </span>

            </div>

          </div>

        </div>

        {/* Action Buttons */}

        <div className="flex justify-center gap-3 mt-6">

          <a
            href={`https://wa.me/91${lead.phoneNumber || lead.phone}`}
            target="_blank"
            className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center hover:scale-105 hover:bg-green-200 transition-all duration-200 shadow-sm"
          >
            <MessageCircle className="text-green-600" size={22}/>
          </a>

          <a
            href={`tel:${lead.phoneNumber || lead.phone}`}
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:scale-105 hover:bg-blue-200 transition-all duration-200 shadow-sm"
          >
            <Phone className="text-blue-600" size={22}/>
          </a>

          <a
            href={`mailto:${lead.email}`}
            className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center hover:scale-105 hover:bg-violet-200 transition-all duration-200 shadow-sm"
          >
            <Mail className="text-violet-600" size={22}/>
          </a>

        </div>

      </div>

      {/* Overview */}

      <div className="p-6 bg-gray-50">

        <h3 className="font-semibold text-lg mb-5 text-gray-900">
          Overview
        </h3>

        <div className="space-y-5">

          <InfoRow
            icon={<GraduationCap size={18}/>}
            label="Course Interested"
            value={lead.courseName || "Lead"}
          />

          <InfoRow
            icon={<GraduationCap size={18}/>}
            label="Lead Source"
            value={lead.leadType || "Website"}
          />

          <InfoRow
            icon={<User size={18}/>}
            label="Assigned To"
            value={lead.assignedTo || "Unassigned"}
          />

          <InfoRow
            icon={<Calendar size={18}/>}
            label="Date Added"
            value={new Date(
              lead.createdAt
            ).toLocaleString()}
          />

          <InfoRow
            icon={<Clock size={18}/>}
            label="Demo Status"
            value={lead.demo || "-"}
          />

          <InfoRow
            icon={<Clock size={18}/>}
            label="Next Follow Up"
            value={lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "-"}
          />

          <InfoRow
            icon={<AlertCircle size={18}/>}
            label="Lead Priority"
            value={lead.leadPriority || "-"}
          />

          <div className="flex justify-between gap-5">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FileText size={18}/>
              Lead Notes
            </div>
            <div className="flex-1">
              {editingNotes ? (
                <div className="flex gap-2">
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await updateLeadNotes(lead._id, notesValue);
                        if (setLeads) {
                          setLeads((prev) =>
                            prev.map((item) =>
                              item._id === lead._id
                                ? { ...item, leadNotes: notesValue }
                                : item
                            )
                          );
                        }
                        setEditingNotes(false);
                      } catch (error) {
                        console.log(error);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : <Save size={16}/>}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-900 font-medium">
                    {lead.leadNotes || "-"}
                  </span>
                  <button
                    onClick={() => {
                      setNotesValue(lead.leadNotes || "");
                      setEditingNotes(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 size={14} className="text-gray-500"/>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-5">

      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        {label}
      </div>

      <div className="font-medium text-right text-sm text-gray-900">
        {value}
      </div>

    </div>
  );
}