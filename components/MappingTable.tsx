"use client";

import { useState } from "react";
import api, { importGoogleLeads } from "@/lib/api";

interface MappingTableProps {
  columns: string[];
}

export default function MappingTable({
  columns,
}: MappingTableProps) {

  console.log("MAPPING COLUMNS:", columns);


  const [mapping, setMapping] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    courseName: "",
  });



  const crmFields = [
    { label: "Lead Name", key: "fullName" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Email", key: "email" },
    { label: "Course", key: "courseName" },
  ];

  
      const saveMapping = async () => {
        try {
      
          console.log("SENDING MAPPING:", mapping);
      
      
          const response = await api.patch(
            "/crm/integrations/google/mapping",
            {
              mapping,
            }
          );
      
      
          console.log(
            "MAPPING SAVED:",
            response.data
          );
      
      
        } catch (error:any) {
      
          console.log(
            "SAVE MAPPING ERROR:",
            error.response?.data || error.message
          );
      
        }
      };
  
      const handleImport = async () => {
        try {
      
          const response = await importGoogleLeads();
      
          console.log("IMPORT RESPONSE:", response);
      
          alert("Leads imported successfully!");
      
        } catch (error: any) {
      
          console.log(
            "IMPORT ERROR:",
            error.response?.data || error.message
          );
      
          alert("Import failed.");
      
        }
      };
  

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">


      <div className="mb-6">

        <h2 className="text-lg font-semibold text-gray-900">
          Column Mapping
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Match Google Sheet columns with CRM fields.
        </p>

      </div>



      <div className="space-y-4">


        {
          crmFields.map((field) => (

            <div
              key={field.key}
              className="grid grid-cols-2 gap-6 items-center"
            >


              <div className="font-medium text-gray-900">
                {field.label}
              </div>



              <select

                value={
                  mapping[
                    field.key as keyof typeof mapping
                  ]
                }


                onChange={(e) => {

                  setMapping((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }));

                }}


                className="
                w-full
                border border-gray-300
                rounded-lg
                px-4
                py-3
                focus:ring-2
                focus:ring-green-600
                focus:border-green-600
                transition-all
                bg-white
                outline-none
                "

              >


                <option value="">
                  Select Google Sheet Column
                </option>



                {
                  columns.map((column) => (

                    <option
                      key={column}
                      value={column}
                    >
                      {column}
                    </option>

                  ))
                }



              </select>


            </div>

          ))
        }


      </div>



      <div className="flex justify-end mt-8 gap-3">


      <button

onClick={saveMapping}

className="
border border-gray-300
px-5
py-2.5
rounded-lg
hover:bg-gray-50
transition-all
font-medium
"

>
Save Mapping
</button>



<button
  onClick={handleImport}
  className="
  bg-green-600
  text-white
  px-6
  py-2.5
  rounded-lg
  hover:bg-green-700
  transition-all
  font-medium
  shadow-sm
  hover:shadow-md
  "
>
  Import Leads
</button>


      </div>


    </div>
  );
}