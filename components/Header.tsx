"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";


export default function Header(){

    const router = useRouter();

    const [user,setUser] = useState<any>(null);
    const [open,setOpen] = useState(false);



    useEffect(()=>{

        const storedUser = localStorage.getItem("crmUser");

        console.log("CRM USER:", storedUser);


        if(storedUser){
            setUser(JSON.parse(storedUser));
        }

    },[]);



    const logout = ()=>{

        localStorage.removeItem("crmToken");
        localStorage.removeItem("crmUser");

        router.push("/login");

    };



    return(

    <div className="
    h-16
    bg-white
    border-b
    border-gray-200
    flex
    items-center
    justify-between
    px-6
    sticky
    top-0
    z-20
    shadow-sm
    ">


        <h2 className="
        font-semibold
        text-gray-800
        text-lg
        ">
            CRM Dashboard
        </h2>



        <div className="relative">


            {/* Profile Button */}

            <button
            onClick={()=>setOpen(!open)}
            className="
            flex
            items-center
            gap-3
            "
            >


                <div
                className="
                w-10
                h-10
                rounded-full
                bg-green-700
                text-white
                flex
                items-center
                justify-center
                font-semibold
                "
                >

                    {
                    user?.name
                    ?
                    user.name.charAt(0).toUpperCase()
                    :
                    "A"
                    }

                </div>


            </button>




            {/* Dropdown */}

            {
            open && (

                <div
                className="
                absolute
                right-0
                mt-3
                w-72
                bg-white
                border
                rounded-2xl
                shadow-xl
                p-5
                "
                >


                    {/* User Info */}

                    <div className="
                    flex
                    items-center
                    gap-3
                    pb-4
                    border-b
                    ">


                        <div
                        className="
                        w-12
                        h-12
                        rounded-full
                        bg-green-700
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-lg
                        "
                        >
                            {
                            user?.name?.charAt(0)
                            ||
                            "A"
                            }
                        </div>



                        <div>

                            <h3 className="
                            font-semibold
                            text-gray-800
                            ">
                                {user?.name || "Admin"}
                            </h3>


                            <p className="
                            text-sm
                            text-gray-500
                            ">
                                {user?.email || ""}
                            </p>


                        </div>


                    </div>



                    {/* Logout */}


                    <button
                    onClick={logout}
                    className="
                    mt-4
                    flex
                    items-center
                    gap-3
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    text-red-600
                    hover:bg-red-50
                    transition
                    "
                    >

                        <LogOut size={18}/>

                        Logout

                    </button>


                </div>

            )
            }



        </div>


    </div>

    )

}