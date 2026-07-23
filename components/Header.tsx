"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import Image from "next/image";


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
                mt-4
                w-80
                bg-white
                border border-gray-200
                rounded-2xl
                shadow-2xl
                overflow-hidden
                "
                >


                    {/* User Info */}

                    <div className="
                    bg-gradient-to-r
                    from-green-600
                    to-green-700
                    p-6
                    text-white
                    flex
                    items-center
                    gap-4
                    ">

                        <div
                        className="
                        w-14
                        h-14
                        rounded-full
                        bg-white
                        text-green-700
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-xl
                        shadow-lg
                        "
                        >
                            {
                            user?.name?.charAt(0)
                            ||
                            "A"
                            }
                        </div>

                        <div className="flex-1">

                            <h3 className="
                            font-semibold
                            text-white
                            text-lg
                            leading-tight
                            ">
                                {user?.name || "Admin"}
                            </h3>

                            <p className="
                            text-sm
                            text-green-100
                            mt-1
                            truncate
                            ">
                                {user?.email || ""}
                            </p>

                        </div>

                    </div>

                    {/* Role Badge */}
                    <div className="
                    px-6
                    pb-6
                    bg-gradient-to-r
                    from-green-600
                    to-green-700
                    ">
                        <span className="
                        text-xs
                        font-semibold
                        px-3 py-1 rounded-full
                        bg-white/20
                        text-white
                        backdrop-blur-sm
                        border border-white/30
                        ">
                            {user?.role === 'admin' || !user?.role ? '👑 Admin' : '👤 User'}
                        </span>
                    </div>

                    {/* Logout */}
                    <div className="
                    p-4
                    bg-gray-50
                    border-t border-gray-200
                    ">
                    <button
                    onClick={logout}
                    className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-white
                    text-red-600
                    border border-red-200
                    hover:bg-red-50
                    hover:border-red-300
                    transition-all
                    font-medium
                    shadow-sm
                    ">
                        <LogOut size={18}/>
                        Logout
                    </button>
                    </div>



                    {/* Logout */}




                </div>

            )
            }



        </div>


    </div>

    )

}