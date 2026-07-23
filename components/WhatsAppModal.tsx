"use client";
import { useState } from "react";
import { markWhatsAppSent } from "@/lib/api";

interface Props {
  lead: any;
  onClose: () => void;
}

export default function WhatsAppModal({
  lead,
  onClose,
}: Props) {

    const [message, setMessage] = useState(`Hi ${lead.fullName},

    Thank you for showing interest in our ${
      lead.courseName || "course"
    }.
    
    Our counselor will contact you shortly.
    
    Regards,
    NRK Academy`);

    const sendWhatsApp = async () => {
        try {
          const phone = lead.phoneNumber || lead.phone;
      
          // Open WhatsApp first
          window.open(
            `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
            "_blank"
          );
      
          // Save message history in CRM
          await markWhatsAppSent(lead._id, message);
      
          onClose();
        } catch (error) {
          console.error(error);
          alert("Failed to save WhatsApp history.");
        }
      };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

      <div className="bg-white rounded-2xl w-[600px] p-6">

        <h2 className="text-2xl font-bold mb-4">
          WhatsApp Preview
        </h2>

        <p className="text-gray-500 mb-5">
          Message will be sent to
        </p>

        <div className="mb-5">
          <div className="font-semibold">
            {lead.fullName}
          </div>

          <div className="text-gray-500">
            {lead.phoneNumber || lead.phone}
          </div>
        </div>

        <textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={10}
  className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-green-500 outline-none"
/>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={sendWhatsApp}
            className="px-5 py-2 rounded-lg bg-green-600 text-white"
          >
            Send WhatsApp
          </button>

        </div>

      </div>

    </div>
  );
}