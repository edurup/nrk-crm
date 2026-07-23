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
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          WhatsApp Communications
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and track all WhatsApp messages sent to leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{msg.fullName}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{msg.phoneNumber}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">{msg.courseName}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          msg.status === 'sent'
                            ? 'bg-green-100 text-green-700'
                            : msg.status === 'delivered'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 text-sm">
                        {new Date(msg.sentAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openWhatsApp(msg.phoneNumber)}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">WhatsApp Message</h2>
                  <p className="text-sm text-gray-500">Message Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMessage.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : selectedMessage.status === 'delivered'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message Content</p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-gray-700">
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
            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => openWhatsApp(selectedMessage.phoneNumber)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Open in WhatsApp
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
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