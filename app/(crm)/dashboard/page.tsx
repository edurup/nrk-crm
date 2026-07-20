"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/api";
import {
  Users,
  UserPlus,
  PhoneCall,
  GraduationCap,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate metrics
  const totalLeads = leads.length;
  const newLeadsToday = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    leadDate.setHours(0, 0, 0, 0);
    return leadDate.getTime() === today.getTime();
  }).length;

  const todayFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() === today.getTime();
  }).length;

  const admissions = leads.filter(lead => lead.status === "Admission Done").length;

  const overdueFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUp) return false;
    const followUpDate = new Date(lead.nextFollowUp);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() < today.getTime();
  }).length;

  // Lead source distribution
  const sourceDistribution = leads.reduce((acc: any, lead) => {
    const source = lead.leadType || "Unknown";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // Lead status breakdown
  const statusBreakdown = leads.reduce((acc: any, lead) => {
    const status = lead.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Recent leads (last 5)
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Today's follow-ups
  const todayFollowUpList = leads
    .filter(lead => {
      if (!lead.nextFollowUp) return false;
      const followUpDate = new Date(lead.nextFollowUp);
      followUpDate.setHours(0, 0, 0, 0);
      return followUpDate.getTime() === today.getTime();
    })
    .slice(0, 5);

  // Lead trends data for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(date);
  }

  const leadTrendsData = last7Days.map(date => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const leadsOnDay = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= dayStart && leadDate <= dayEnd;
    }).length;

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      leads: leadsOnDay
    };
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      icon: <Users size={24} />,
      color: "bg-blue-100 text-blue-700",
      change: "+12%",
      positive: true
    },
    {
      title: "New Today",
      value: newLeadsToday.toString(),
      icon: <UserPlus size={24} />,
      color: "bg-green-100 text-green-700",
      change: "+5%",
      positive: true
    },
    {
      title: "Today's Follow-ups",
      value: todayFollowUps.toString(),
      icon: <PhoneCall size={24} />,
      color: "bg-yellow-100 text-yellow-700",
      change: "-3%",
      positive: false
    },
    {
      title: "Admissions",
      value: admissions.toString(),
      icon: <GraduationCap size={24} />,
      color: "bg-purple-100 text-purple-700",
      change: "+8%",
      positive: true
    }
  ];

  return (
    <div className="w-full p-6 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, manage your leads and admissions here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex items-center text-sm ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={16} className="mr-1" />
                {item.change}
              </div>
            </div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Alert for overdue follow-ups */}
      {overdueFollowUps > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <div className="flex-1">
            <p className="font-medium text-red-800">{overdueFollowUps} Overdue Follow-ups</p>
            <p className="text-sm text-red-600">Some follow-ups are past due. Check the Follow-ups page.</p>
          </div>
        </div>
      )}

      {/* Lead Trends Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-gray-900">Lead Trends (Last 7 Days)</h2>
          <span className="text-sm text-gray-500">Daily lead generation</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leadTrendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-gray-900">Recent Leads</h2>
            <span className="text-sm text-gray-500">Last 5 leads</span>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No leads yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Course</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{lead.fullName}</div>
                        <div className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3 text-sm text-gray-700">{lead.phoneNumber || lead.phone || "-"}</td>
                      <td className="p-3 text-sm text-gray-700">{lead.courseName || "-"}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {lead.status || "New Lead"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-5">Lead Sources</h2>
          <div className="space-y-4">
            {Object.entries(sourceDistribution).map(([source, count]: [string, any]) => {
              const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{source}</span>
                    <span className="text-gray-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Follow-ups */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-gray-900">Today's Follow-ups</h2>
            <span className="text-sm text-gray-500">{todayFollowUpList.length} scheduled</span>
          </div>

          {todayFollowUpList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No follow-ups scheduled for today</div>
          ) : (
            <div className="space-y-3">
              {todayFollowUpList.map((lead) => (
                <div key={lead._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm">
                    {lead.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lead.fullName}</p>
                    <p className="text-sm text-gray-500">{lead.courseName || "No course"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">
                      {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </p>
                    <p className="text-xs text-gray-400">{lead.assignedTo || "Unassigned"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-5">Status Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">Count</th>
                  <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(statusBreakdown).map(([status, count]: [string, any]) => {
                  const colors: Record<string, string> = {
                    "New Lead": "bg-blue-100 text-blue-700",
                    "Contacted": "bg-indigo-100 text-indigo-700",
                    "Interested": "bg-green-100 text-green-700",
                    "Follow-up": "bg-yellow-100 text-yellow-700",
                    "Admission Done": "bg-emerald-100 text-emerald-700",
                    "Not Interested": "bg-red-100 text-red-700",
                  };
                  const color = colors[status] || "bg-gray-100 text-gray-700";
                  const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0;
                  return (
                    <tr key={status} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={16} className={color.replace("bg-", "text-").replace("100", "600")} />
                          <span className="text-gray-700">{status}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                          {count}
                        </span>
                      </td>
                      <td className="p-3 text-right text-gray-700">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}