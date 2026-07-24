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
    <div className="w-full p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Heading */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Welcome back! Here's your CRM overview for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <div className={`flex items-center text-sm font-semibold ${item.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full`}>
                <TrendingUp size={16} className="mr-1" />
                {item.change}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{item.title}</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Alert for overdue follow-ups */}
      {overdueFollowUps > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-5 flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-red-800 text-lg">{overdueFollowUps} Overdue Follow-ups</p>
            <p className="text-sm text-red-600">Some follow-ups are past due. Check the Follow-ups page to take action.</p>
          </div>
        </div>
      )}

      {/* Lead Trends Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-gray-900">Lead Trends</h2>
            <p className="text-sm text-gray-500 mt-1">Daily lead generation over the last 7 days</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <span className="text-sm text-gray-600">Leads</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={leadTrendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={13}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={13}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl text-gray-900">Recent Leads</h2>
              <p className="text-sm text-gray-500 mt-1">Last 5 leads added to your CRM</p>
            </div>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Users className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No leads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Course</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{lead.fullName}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-700 font-medium">{lead.phoneNumber || lead.phone || "-"}</td>
                      <td className="p-4 text-sm text-gray-700">{lead.courseName || "-"}</td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200">
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7">
          <h2 className="font-bold text-xl text-gray-900 mb-6">Lead Sources</h2>
          <div className="space-y-5">
            {Object.entries(sourceDistribution).map(([source, count]: [string, any]) => {
              const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0;
              const colors: Record<string, string> = {
                "Website": "bg-blue-500",
                "Google Sheet": "bg-green-500",
                "WhatsApp": "bg-emerald-500",
                "Facebook": "bg-indigo-500",
                "Instagram": "bg-pink-500",
                "Manual": "bg-purple-500",
              };
              const barColor = colors[source] || "bg-violet-500";
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-semibold">{source}</span>
                    <span className="text-gray-500 font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${barColor} h-3 rounded-full transition-all duration-500 ease-out`}
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl text-gray-900">Today's Follow-ups</h2>
              <p className="text-sm text-gray-500 mt-1">{todayFollowUpList.length} scheduled for today</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Calendar className="text-yellow-600" size={20} />
            </div>
          </div>

          {todayFollowUpList.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <PhoneCall className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No follow-ups scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayFollowUpList.map((lead) => (
                <div key={lead._id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-white rounded-xl border border-violet-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {lead.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{lead.fullName}</p>
                    <p className="text-sm text-gray-500">{lead.courseName || "No course"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{lead.assignedTo || "Unassigned"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7">
          <h2 className="font-bold text-xl text-gray-900 mb-6">Status Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Count</th>
                  <th className="text-right p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(statusBreakdown).map(([status, count]: [string, any]) => {
                  const colors: Record<string, string> = {
                    "New Lead": "bg-blue-100 text-blue-700 border-blue-200",
                    "Contacted": "bg-indigo-100 text-indigo-700 border-indigo-200",
                    "Interested": "bg-green-100 text-green-700 border-green-200",
                    "Follow-up": "bg-yellow-100 text-yellow-700 border-yellow-200",
                    "Admission Done": "bg-emerald-100 text-emerald-700 border-emerald-200",
                    "Not Interested": "bg-red-100 text-red-700 border-red-200",
                  };
                  const color = colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
                  const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0;
                  return (
                    <tr key={status} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                            <CheckCircle size={16} className="text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${color} border`}>
                          {count}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-700 font-semibold">{percentage}%</td>
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