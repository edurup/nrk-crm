"use client";

import {
  Users,
  UserPlus,
  PhoneCall,
  GraduationCap
} from "lucide-react";


export default function DashboardPage(){


  const stats = [
    {
      title:"Total Leads",
      value:"1,248",
      icon:<Users size={24}/>,
      color:"bg-blue-100 text-blue-700"
    },
    {
      title:"New Leads Today",
      value:"35",
      icon:<UserPlus size={24}/>,
      color:"bg-green-100 text-green-700"
    },
    {
      title:"Follow Ups",
      value:"18",
      icon:<PhoneCall size={24}/>,
      color:"bg-yellow-100 text-yellow-700"
    },
    {
      title:"Admissions",
      value:"72",
      icon:<GraduationCap size={24}/>,
      color:"bg-purple-100 text-purple-700"
    }
  ];



  return(

    <div className="space-y-6">


      {/* Heading */}

      <div>

        <h1 className="
        text-3xl
        font-bold
        text-gray-800
        ">
          Dashboard
        </h1>


        <p className="
        text-gray-500
        mt-1
        ">
          Welcome back, manage your leads and admissions here.
        </p>


      </div>





      {/* Stats Cards */}


      <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4
      gap-5
      ">


        {
          stats.map((item,index)=>(

            <div
            key={index}
            className="
            bg-white
            rounded-2xl
            border
            shadow-sm
            p-5
            flex
            items-center
            justify-between
            "
            >


              <div>

                <p className="
                text-gray-500
                text-sm
                ">
                  {item.title}
                </p>


                <h2 className="
                text-3xl
                font-bold
                mt-2
                ">
                  {item.value}
                </h2>


              </div>



              <div
              className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              ${item.color}
              `}
              >

                {item.icon}

              </div>


            </div>


          ))
        }


      </div>





      {/* Bottom Section */}

      <div className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-6
      ">


        {/* Recent Leads */}

        <div className="
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-6
        ">


          <h2 className="
          font-semibold
          text-lg
          mb-5
          ">
            Recent Leads
          </h2>


          <div className="space-y-4">


            {
              [
                "Riya Singh - Data Analytics",
                "Amit Sharma - Python",
                "Priya Patel - MERN"
              ].map((lead,index)=>(

                <div
                key={index}
                className="
                flex
                justify-between
                border-b
                pb-3
                "
                >

                  <span>
                    {lead}
                  </span>


                  <span className="
                  text-sm
                  text-blue-600
                  ">
                    New
                  </span>


                </div>


              ))
            }


          </div>


        </div>





        {/* Follow Ups */}

        <div className="
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-6
        ">


          <h2 className="
          font-semibold
          text-lg
          mb-5
          ">
            Today's Follow Ups
          </h2>



          <div className="space-y-4">


          {
            [
              "10:30 AM - Call Amit",
              "1:00 PM - Demo Follow-up",
              "4:30 PM - Admission Discussion"
            ]
            .map((item,index)=>(

              <div
              key={index}
              className="
              bg-gray-50
              rounded-xl
              p-3
              "
              >
                {item}
              </div>

            ))
          }


          </div>


        </div>


      </div>


    </div>


  );

}