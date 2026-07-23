"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function CRMLoginPage(){

    const router = useRouter();


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loginType, setLoginType] = useState<"admin" | "user">("admin");

    const [loading,setLoading] = useState(false);


    const handleLogin = async(e:React.FormEvent)=>{

        e.preventDefault();

        try{

            setLoading(true);

            const endpoint = loginType === "admin" 
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/auth/login`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/users/login`;
            
            console.log("API URL:", endpoint);
              
            const res = await axios.post(
                endpoint,
                {
                    email,
                    password
                }
            );


            const token = res.data.token;

localStorage.setItem(
  "crmToken",
  token
);

localStorage.setItem(
  "crmUser",
  JSON.stringify(res.data.admin || res.data.user)
);

router.push("/dashboard");


        }
        catch(error){

            console.log(error);

            alert("Invalid email or password");

        }
        finally{

            setLoading(false);

        }

    };


    return(

        <div className="
        min-h-screen 
        flex 
        items-center 
        justify-center
        bg-gray-100
        ">


            <form
            onSubmit={handleLogin}
            className="
            bg-white
            p-8
            rounded-2xl
            shadow-lg
            w-[400px]
            "
            >

                <h1 className="
                text-2xl 
                font-bold 
                mb-6
                text-center
                ">
                    {loginType === "admin" ? "CRM Admin Login" : "CRM User Login"}
                </h1>

                {/* Login Type Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => setLoginType("admin")}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                            loginType === "admin"
                                ? "bg-violet-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType("user")}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                            loginType === "user"
                                ? "bg-violet-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        User
                    </button>
                </div>


                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                mb-4
                "
                />


                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                mb-6
                "
                />


                <button
                disabled={loading}
                className="
                w-full
                bg-violet-600
                text-white
                py-3
                rounded-lg
                "
                >

                {
                    loading
                    ? "Logging in..."
                    : "Login"
                }

                </button>


            </form>


        </div>

    );

}