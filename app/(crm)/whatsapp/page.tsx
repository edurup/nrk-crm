"use client";

import { useEffect, useState } from "react";
import { getWhatsAppHistory } from "@/lib/api";
import {
  MessageCircle,
  Send,
  Clock,
  Calendar,
  Search,
  Filter,
  X,
  Phone,
  ExternalLink
} from "lucide-react";

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getWhatsAppHistory();
        setMessages(data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const today = new Date();

  const totalMessages = messages.length;

  const todayMessages = messages.filter((msg) => {
    const date = new Date(msg.sentAt);
    return date.toDateString() === today.toDateString();
  }).length;

  const weekMessages = messages.filter((msg) => {
    const date = new Date(msg.sentAt);
    const diff =
      (today.getTime() - date.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= 7;
  }).length;

  const monthMessages = messages.filter((msg) => {
    const date = new Date(msg.sentAt);

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.phoneNumber?.includes(searchTerm) ||
      msg.courseName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openWhatsApp = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Messages",
      value: totalMessages,
      icon: <MessageCircle size={24} />,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Sent Today",
      value: todayMessages,
      icon: <Send size={24} />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "This Week",
      value: weekMessages,
      icon: <Clock size={24} />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "This Month",
      value: monthMessages,
      icon: <Calendar size={24} />,
      color: "bg-orange-100 text-orange-700"
    }
  ];

  return (
    <div className="w-full p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Heading */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          WhatsApp Communications
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Manage and track all WhatsApp messages sent to leads.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="p-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="p-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="p-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="p-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <MessageCircle className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No messages found</h3>
                    <p className="text-gray-500 text-lg">Try adjusting your filters or send WhatsApp messages to leads.</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all"
                  >
                    <td className="p-5">
                      <div className="font-semibold text-gray-900">{msg.fullName}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-700 font-medium">{msg.phoneNumber}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-700">{msg.courseName}</div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold border ${
                          msg.status === 'sent'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : msg.status === 'delivered'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="text-gray-700 text-sm font-medium">
                        {new Date(msg.sentAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openWhatsApp(msg.phoneNumber)}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium flex items-center gap-2 shadow-md"
                        >
                          <MessageCircle size={16} />
                          Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 p-6 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-md">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">WhatsApp Message</h2>
                  <p className="text-sm text-gray-500">Message Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lead Name</p>
                  <p className="font-semibold text-gray-900">{selectedMessage.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{selectedMessage.phoneNumber}</p>
                    <button
                      onClick={() => openWhatsApp(selectedMessage.phoneNumber)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Course</p>
                  <p className="font-semibold text-gray-900">{selectedMessage.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold border ${
                      selectedMessage.status === 'sent'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : selectedMessage.status === 'delivered'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message Content</p>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 whitespace-pre-wrap leading-relaxed text-gray-700 shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Sent At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedMessage.sentAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => openWhatsApp(selectedMessage.phoneNumber)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center gap-2 shadow-md"
              >
                <MessageCircle size={18} />
                Open in WhatsApp
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold border border-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}