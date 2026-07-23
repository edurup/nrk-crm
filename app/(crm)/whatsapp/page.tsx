"use client";

import { useEffect, useState } from "react";
import { getWhatsAppHistory } from "@/lib/api";

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

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


  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        WhatsApp History
      </h1>

      <div className="grid grid-cols-4 gap-5 mb-8">

  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-gray-500 text-sm">Total Messages</p>
    <h2 className="text-3xl font-bold mt-2">
      {totalMessages}
    </h2>
  </div>

  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-gray-500 text-sm">Sent Today</p>
    <h2 className="text-3xl font-bold mt-2 text-green-600">
      {todayMessages}
    </h2>
  </div>

  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-gray-500 text-sm">This Week</p>
    <h2 className="text-3xl font-bold mt-2 text-blue-600">
      {weekMessages}
    </h2>
  </div>

  <div className="bg-white rounded-xl border p-5 shadow-sm">
    <p className="text-gray-500 text-sm">This Month</p>
    <h2 className="text-3xl font-bold mt-2 text-violet-600">
      {monthMessages}
    </h2>
  </div>

</div>

      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Sent At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {messages.map((msg) => (

              <tr
                key={msg._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{msg.fullName}</td>

                <td className="p-3">
                  {msg.phoneNumber}
                </td>

                <td className="p-3">
                  {msg.courseName}
                </td>

                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {msg.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(msg.sentAt).toLocaleString()}
                </td>

                <td className="p-3 text-center">

                  <button
                    onClick={() => setSelectedMessage(msg)}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* View Message Modal */}

      {selectedMessage && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[650px] max-w-[95%] shadow-xl">

            <div className="flex justify-between items-center border-b p-6">

              <h2 className="text-2xl font-bold">
                WhatsApp Message
              </h2>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>

            </div>

            <div className="p-6 space-y-5">

              <div>

                <p className="text-sm text-gray-500">
                  Lead Name
                </p>

                <p className="font-semibold text-lg">
                  {selectedMessage.fullName}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-semibold">
                  {selectedMessage.phoneNumber}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Course
                </p>

                <p className="font-semibold">
                  {selectedMessage.courseName}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Message
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 whitespace-pre-wrap leading-7">
                  {selectedMessage.message}
                </div>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Sent At
                </p>

                <p className="font-semibold">
                  {new Date(selectedMessage.sentAt).toLocaleString()}
                </p>

              </div>

            </div>

            <div className="border-t p-5 flex justify-end">

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
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