"use client";

interface Props {
  leads: any[];
  selected: string;
  setSelected: (value: string) => void;
}

export default function LeadTabs({
  leads,
  selected,
  setSelected,
}: Props) {
  const tabs = [
    {
      label: "All Leads",
      value: "all",
      count: leads.length,
    },
    {
      label: "New",
      value: "New Lead",
      count: leads.filter(
        (l) => l.status === "New Lead" || l.status === "pending"
      ).length,
    },
    {
      label: "Contacted",
      value: "Contacted",
      count: leads.filter((l) => l.status === "Contacted").length,
    },
    {
      label: "Interested",
      value: "Interested",
      count: leads.filter((l) => l.status === "Interested").length,
    },
    {
      label: "Follow-up",
      value: "Follow-up",
      count: leads.filter((l) => l.status === "Follow-up").length,
    },
    {
      label: "Admission Done",
      value: "Admission Done",
      count: leads.filter((l) => l.status === "Admission Done").length,
    },
    {
      label: "Not Interested",
      value: "Not Interested",
      count: leads.filter((l) => l.status === "Not Interested").length,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelected(tab.value)}
            className={`py-4 whitespace-nowrap border-b-2 font-medium text-sm transition-all duration-200
              ${
                selected === tab.value
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label} <span className="text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}