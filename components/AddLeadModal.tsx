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
        dob: "",
        gender: "",
        city: "",
        state: "",
        pincode: "",
        address: "",
        qualification: "",
        college: "",
        passingYear: "",
        percentage: "",
        batchPreference: "",
        paymentOption: "",
        agree: false,
        demo: "",
        demoDateTime: "",
        nextFollowUp: "",
        leadPriority: "",
        leadNotes: "",
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

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">


      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 shadow-xl overflow-y-auto">


        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Add New Lead
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="phoneNumber"
            placeholder="Mobile Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all md:col-span-2"
          />

          <input
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="passingYear"
            placeholder="Passing Year"
            value={form.passingYear}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="percentage"
            placeholder="Percentage"
            value={form.percentage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <select
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Select Course</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Data Science">Data Science</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
          </select>

          <select
            name="batchPreference"
            value={form.batchPreference}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Batch Preference</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Weekend">Weekend</option>
          </select>

          <select
            name="paymentOption"
            value={form.paymentOption}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Payment Option</option>
            <option value="Full Payment">Full Payment</option>
            <option value="EMI">EMI</option>
            <option value="Installments">Installments</option>
          </select>

          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Neha Verma">Neha Verma</option>
            <option value="Amit Singh">Amit Singh</option>
            <option value="Priya Sharma">Priya Sharma</option>
            <option value="Rahul Patel">Rahul Patel</option>
          </select>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <label className="text-sm text-gray-600">I agree to the terms and conditions</label>
          </div>

          <select
            name="demo"
            value={form.demo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Demo Status</option>
            <option value="Will Join">Will Join</option>
            <option value="Not Joined">Not Joined</option>
            <option value="Joined">Joined</option>
          </select>

          <input
            name="demoDateTime"
            type="datetime-local"
            placeholder="Demo Date & Time"
            value={form.demoDateTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <input
            name="nextFollowUp"
            type="date"
            placeholder="Next Follow Up"
            value={form.nextFollowUp}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />

          <select
            name="leadPriority"
            value={form.leadPriority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all bg-white"
          >
            <option value="">Lead Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            name="leadNotes"
            placeholder="Lead Notes"
            value={form.leadNotes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all md:col-span-2"
          />

        </div>


        <div className="flex justify-end gap-3 mt-6">


          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>


          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium shadow-sm hover:shadow-md"
          >
            Save Lead
          </button>


        </div>


      </div>


    </div>

  );
}