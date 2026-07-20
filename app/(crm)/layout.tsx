"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";


export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {

    const token = localStorage.getItem("crmToken");


    // Allow login page without authentication
    if (pathname === "/login") {
      return;
    }


    // Redirect if no token
    if (!token) {
      router.push("/login");
    }


  }, [pathname, router]);



  // Don't show CRM layout on login page
  if (pathname === "/login") {
    return (
      <>
        {children}
      </>
    );
  }



  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-w-0">

        <Header />

        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>

      </div>

    </div>
  );
}