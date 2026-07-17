"use client";

import { useState } from "react";
import { createLead } from "@/lib/api";

interface Props {
  setLeads: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
}

export default function AddLeadModal({
  setLeads,
  onClose,
}: Props) {

    const [form, setForm] = useState({
        formType: "lead",
        fullName: "",
        email: "",
        phoneNumber: "",
        courseName: "",
        leadSource: "Manual",
        leadType: "Manual",
        assignedTo: "Unassigned",
        status: "New Lead",
    });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async () => {

    try {

      const response = await createLead(form);


      setLeads(prev => [
        response.data,
        ...prev
      ]);


      onClose();


    } catch(error){

      console.log(error);

    }

  };


  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white w-[500px] rounded-2xl p-6 shadow-xl">


        <h2 className="text-xl font-bold mb-5">
          Add New Lead
        </h2>


        <div className="space-y-4">


          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />


          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />


          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />


<select
  name="courseName"
  value={form.courseName}
  onChange={handleChange}
  className="w-full border rounded-lg px-4 py-2"
>

  <option value="">
    Select Course
  </option>

  <option value="Data Analytics">
    Data Analytics
  </option>

  <option value="MERN Stack Development">
    Data Science
  </option>

  <option value="Digital Marketing">
    Digital Marketing
  </option>

  <option value="Digital Marketing">
    Full Stack Developer
  </option>


</select>


          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >

            <option>
              Unassigned
            </option>

            <option>
              Neha Verma
            </option>

            <option>
              Amit Singh
            </option>

            <option>
              Priya Sharma
            </option>

          </select>


        </div>


        <div className="flex justify-end gap-3 mt-6">


          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>


          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-violet-600 text-white rounded-lg"
          >
            Save Lead
          </button>


        </div>


      </div>


    </div>

  );
}