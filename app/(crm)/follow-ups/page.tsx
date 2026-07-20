"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/api";
import { Phone, MessageCircle, Mail, Calendar, RefreshCw } from "lucide-react";

export default function FollowUpsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [counselorFilter, setCounselorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() === today.getTime();
  });

  const overdueFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() < today.getTime();
  });

  const upcomingFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() > today.getTime();
  });

  const getFollowUpStatus = (lead: any) => {
    if (!lead.nextFollowUp) return "none";
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    
    if (followUpDate.getTime() < today.getTime()) return "overdue";
    if (followUpDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue": return "bg-red-100 text-red-700";
      case "today": return "bg-orange-100 text-orange-700";
      case "upcoming": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    
    if (search && !lead.fullName?.toLowerCase().includes(search.toLowerCase()) && 
        !lead.phoneNumber?.includes(search)) return false;
    
    if (courseFilter !== "all" && lead.courseName !== courseFilter) return false;
    
    if (counselorFilter !== "all" && lead.assignedTo !== counselorFilter) return false;
    
    const status = getFollowUpStatus(lead);
    if (statusFilter !== "all" && status !== statusFilter) return false;
    
    if (dateFilter === "today" && status !== "today") return false;
    if (dateFilter === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const followUpDate = new Date(lead.nextFollowUp);
      followUpDate.setHours(0, 0, 0, 0);
      if (followUpDate.getTime() !== tomorrow.getTime()) return false;
    }
    if (dateFilter === "week") {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const followUpDate = new Date(lead.nextFollowUp);
      if (followUpDate.getTime() < today.getTime() || followUpDate.getTime() > weekEnd.getTime()) return false;
    }
    if (dateFilter === "overdue" && status !== "overdue") return false;
    if (dateFilter === "upcoming" && status !== "upcoming") return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Follow-ups</h1>
      <p className="text-gray-500 mb-6">Manage and track your follow-up activities</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Follow-ups</p>
              <p className="text-2xl font-bold text-gray-900">{todayFollowUps.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="text-orange-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Leads that need to be contacted today</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueFollowUps.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <RefreshCw className="text-red-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Follow-up date has passed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingFollowUps.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Scheduled for future dates</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total with Follow-ups</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.nextFollowUp).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Leads with scheduled follow-ups</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
          >
            <option value="all">All Courses</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Data Science">Data Science</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
          </select>

          <select
            value={counselorFilter}
            onChange={(e) => setCounselorFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
          >
            <option value="all">All Counselors</option>
            <option value="Neha Verma">Neha Verma</option>
            <option value="Amit Singh">Amit Singh</option>
            <option value="Priya Sharma">Priya Sharma</option>
            <option value="Rahul Patel">Rahul Patel</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Counselor</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Follow-up Date</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No follow-ups found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const status = getFollowUpStatus(lead);
                return (
                  <tr key={lead._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{lead.fullName}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{lead.phoneNumber || lead.phone || "-"}</div>
                      <div className="text-xs text-gray-400 mt-1">{lead.email}</div>
                    </td>
                    <td className="p-4 text-gray-700">{lead.courseName || "-"}</td>
                    <td className="p-4 text-gray-700">{lead.assignedTo || "Unassigned"}</td>
                    <td className="p-4 text-gray-700">
                      {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${lead.phoneNumber || lead.phone}`}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                          title="Call"
                        >
                          <Phone className="text-blue-600" size={16} />
                        </a>
                        <a
                          href={`https://wa.me/91${lead.phoneNumber || lead.phone}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="text-green-600" size={16} />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 rounded-lg bg-violet-100 hover:bg-violet-200 transition-colors"
                          title="Email"
                        >
                          <Mail className="text-violet-600" size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
