"use client";

import {
  Users,
  UserPlus,
  PhoneCall,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";

interface Props {
  leads: any[];
}

export default function StatsCards({ leads }: Props) {
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) =>
      lead.status === "New Lead" ||
      lead.status === "pending"
  ).length;

  const contacted = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const interested = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const admissionDone = leads.filter(
    (lead) => lead.status === "Admission Done"
  ).length;

  const cards = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "New Leads",
      value: newLeads,
      icon: UserPlus,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Contacted",
      value: contacted,
      icon: PhoneCall,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Interested",
      value: interested,
      icon: HeartHandshake,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Admissions Done",
      value: admissionDone,
      icon: GraduationCap,
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      color: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8 animate-fade-in">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2 text-gray-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconBg} shadow-sm`}
              >
                <Icon
                  className={`w-7 h-7 ${card.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}