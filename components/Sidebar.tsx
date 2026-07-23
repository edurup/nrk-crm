"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Users,
  PhoneCall,
  MessageCircle,
  Mail,
  BarChart3,
  Settings,
  Plug,
  FileSpreadsheet
} from "lucide-react";


const allMenu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Leads",
    icon: Users,
    path: "/leads",
  },
  {
    name: "Integration",
    icon: Plug,
    path: "/integrations",
    adminOnly: true,
  },
  {
    name: "Imported Sheets",
    path: "/imported-sheets",
    icon: FileSpreadsheet,
    adminOnly: true,
  },
  {
    name: "Follow Ups",
    icon: PhoneCall,
    path: "/follow-ups",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    path: "/whatsapp",
  },
  {
    name: "Emails",
    icon: Mail,
    path: "/emails",
  },
  {
    name: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];



export default function Sidebar(){

const pathname = usePathname();
const [menu, setMenu] = useState(allMenu);

useEffect(() => {
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
  const isAdmin = currentUser.role === 'admin' || !currentUser.role; // CRMAdmin has no role field
  
  // Filter menu based on user role
  if (isAdmin) {
    setMenu(allMenu);
  } else {
    setMenu(allMenu.filter(item => !item.adminOnly));
  }
}, []);

return (

<div
className="
w-64
h-screen
bg-white
border-r
border-gray-200
fixed
left-0
top-0
z-10
">


<div
className="
h-16
flex
items-center
px-6
border-b
border-gray-200
">
<div className="h-10 w-32 relative">
  <Image
    src="/nrklogo.png"
    height={40}
    width={128}
    alt="NRK Logo"
    className="object-contain"
    priority
    sizes="128px"
  />
</div>
</div>



<div className="p-4 space-y-1">


{
menu.map((item)=>{


const Icon = item.icon;


const active = pathname === item.path;


return (

<Link
href={item.path}
key={item.name}
className={`
flex
items-center
gap-3
px-4
py-2.5
rounded-lg
transition-all
duration-200
font-medium
text-sm

${
active
?
"bg-green-100 text-green-800"
:
"text-gray-700 hover:bg-green-50"
}

`}
>


<Icon
size={18}
className={
active
?
"text-green-700"
:
"text-gray-500"
}
/>


<span>
{item.name}
</span>


</Link>


)


})
}


</div>


</div>

)

}