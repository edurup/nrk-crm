"use client";
import {
    updateLeadStatus,
    updateLeadAssignment,
  } from "@/lib/api";

  interface Props {
    leads:any[];
    setLeads: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedLead: React.Dispatch<React.SetStateAction<any>>;
    selectedLead:any;
  }

  const sourceColors: Record<string, string> = {
    "Request Call": "bg-green-100 text-green-700",
    "Download Brochure": "bg-blue-100 text-blue-700",
    "Admission": "bg-purple-100 text-purple-700",
    "Free Live Class": "bg-orange-100 text-orange-700",
    "Website Lead": "bg-gray-100 text-gray-700",
  };

const statusOptions = [
    "New Lead",
    "Contacted",
    "Interested",
    "Follow-up",
    "Admission Done",
    "Not Interested",
    "Free Classes Registered",
    "Demo Attended",
  ];

  const assignedUsers = [
    "Unassigned",
    "Neha Verma",
    "Amit Singh",
    "Priya Sharma",
    "Rahul Patel",
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
  
    "New Lead": "bg-blue-100 text-blue-700",
  
    Contacted: "bg-indigo-100 text-indigo-700",
  
    Interested: "bg-green-100 text-green-700",
  
    "Follow-up": "bg-yellow-100 text-yellow-700",
  
    "Admission Done": "bg-emerald-100 text-emerald-700",
  
    "Not Interested": "bg-red-100 text-red-700",
  
    "Free Classes Registered": "bg-purple-100 text-purple-700",
  
    "Demo Attended": "bg-orange-100 text-orange-700",
  };

const getTimeAgo = (date:string) => {

  const now = new Date();
  const created = new Date(date);

  const seconds = Math.floor(
    (now.getTime() - created.getTime()) / 1000
  );


  if(seconds < 60)
    return "Just now";


  const minutes = Math.floor(seconds / 60);

  if(minutes < 60)
    return `${minutes} min ago`;


  const hours = Math.floor(minutes / 60);

  if(hours < 24)
    return `${hours} hr ago`;


  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? "s" : ""} ago`;

};



export default function LeadTable({
    leads,
    setLeads,
    setSelectedLead,
    selectedLead
}:Props) {

return(

<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">

<table className="w-full border-collapse">

<thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">

<tr>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Name
</th>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Contact
</th>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Course
</th>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Source
</th>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Status
</th>


<th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
Assigned To
</th>


</tr>

</thead>



<tbody>

{
leads.map((lead)=>(

<tr
key={lead._id}
onClick={() => setSelectedLead(lead)}
className={`
border-t border-gray-100
cursor-pointer
transition-all duration-200
hover:bg-violet-50 hover:shadow-sm

${
selectedLead?._id===lead._id
?"bg-violet-50 shadow-sm ring-1 ring-violet-200 ring-inset"
:""
}
`}
>


{/* NAME */}

<td className="p-4">

<div className="font-semibold text-gray-900 text-sm">
{lead.fullName}
</div>

<div className="text-xs text-gray-400 mt-1">
{getTimeAgo(lead.createdAt)}
</div>

</td>



{/* CONTACT */}

<td className="p-4">

<div className="text-gray-700 text-sm">
{lead.phoneNumber || lead.phone || "-"}
</div>

<div className="text-xs text-gray-400 mt-1">
{lead.email}
</div>

</td>



{/* COURSE */}

<td className="p-4">

<div className="text-gray-700 text-sm">
{lead.courseName || "Lead"}
</div>

</td>



{/* SOURCE */}

<td className="p-4">
  <span
    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
      sourceColors[lead.leadType] ||
      "bg-gray-100 text-gray-700"
    }`}
  >
    {lead.leadType || "Website Lead"}
  </span>
</td>



{/* STATUS */}

<td className="p-3">

<select
onClick={(e) => e.stopPropagation()}
value={lead.status || "New Lead"}
onChange={async (e)=>{

  const newStatus = e.target.value;

  try {

    await updateLeadStatus(
        lead._id,
        newStatus
      );
      
      setLeads(prev =>
        prev.map(item =>
          item._id === lead._id
            ? {...item, status:newStatus}
            : item
        )
      );

  } catch(error){

    console.log(error);

  }

}}

className={`px-3 py-2 rounded-full border-0 text-xs font-medium cursor-pointer outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1
${statusColors[lead.status] || "bg-gray-100 text-gray-700"}`}
>

{
statusOptions.map((status)=>(
<option 
key={status}
value={status}
>
{status}
</option>
))
}

</select>

</td>



{/* ASSIGNED */}

<td className="p-4">
  <div className="flex items-center gap-2">

    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-xs">
      {(lead.assignedTo || "U")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)}
    </div>

    <select
      value={lead.assignedTo || "Unassigned"}
      onClick={(e) => e.stopPropagation()}
      onChange={async (e) => {
        const assignedTo = e.target.value;

        try {
          await updateLeadAssignment(
            lead._id,
            assignedTo
          );

          setLeads((prev) =>
            prev.map((item) =>
              item._id === lead._id
                ? { ...item, assignedTo }
                : item
            )
          );
        } catch (error) {
          console.log(error);
        }
      }}
      className="border-0 bg-transparent text-sm font-medium outline-none cursor-pointer"
    >
      {assignedUsers.map((user) => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>

  </div>
</td>


</tr>

))
}


</tbody>


</table>

</div>

)

}