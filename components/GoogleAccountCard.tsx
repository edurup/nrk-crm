"use client";
import { useEffect, useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function GoogleAccountCard() {
  const [integration, setIntegration] = useState<any>(null);
const [loading, setLoading] = useState(true);

const fetchGoogleIntegration = async () => {
  try {
    const token = localStorage.getItem("crmToken");

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/integrations/google`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIntegration(res.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchGoogleIntegration();
}, []);

  const handleGoogleConnect = async () => {

    try {
      const token = localStorage.getItem("crmToken");
  
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/integrations/google/connect`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      alert("Unable to connect Google.");
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Google Account
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Connect your Google account to access Google Sheets.
          </p>

        </div>

        <button
  onClick={handleGoogleConnect}
  className="
    bg-green-600
    hover:bg-green-700
    text-white
    px-5
    py-2.5
    rounded-lg
    font-medium
    transition-all
    shadow-sm
    hover:shadow-md
  "
>
  {integration?.connected ? "Reconnect Google" : "Connect Google"}
</button>

      </div>

      <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-gray-100">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">

            <Mail className="text-green-700" size={20} />

          </div>

          <div className="flex-1">

          {loading ? (
  <>
    <p className="font-semibold text-gray-900">
      Loading...
    </p>

    <p className="text-sm text-gray-500">
      Checking Google connection...
    </p>
  </>
) : integration?.connected ? (
  <>
    <p className="font-semibold text-green-700">
      Connected
    </p>

    <p className="text-sm text-gray-600">
      {integration.accountEmail}
    </p>
  </>
) : (
  <>
    <p className="font-semibold text-gray-900">
      No Google Account Connected
    </p>

    <p className="text-sm text-gray-500">
      Connect your Google account to start importing leads.
    </p>
  </>
)}

          </div>

          <CheckCircle2
  size={22}
  className={
    integration?.connected
      ? "text-green-600"
      : "text-gray-300"
  }
/>

        </div>

      </div>

    </div>
  );
}