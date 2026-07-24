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
        bg-gradient-to-br from-violet-50 via-white to-green-50
        p-4
        ">

            <form
            onSubmit={handleLogin}
            className="
            bg-white
            p-10
            rounded-3xl
            shadow-2xl
            w-full
            max-w-md
            border border-gray-100
            "
            >

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="
                    text-3xl 
                    font-bold 
                    mb-2
                    text-center
                    bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent
                    ">
                        NRK CRM
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {loginType === "admin" ? "Admin Login" : "User Login"}
                    </p>
                </div>

                {/* Login Type Toggle */}
                <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setLoginType("admin")}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            loginType === "admin"
                                ? "bg-white text-violet-600 shadow-md"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType("user")}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            loginType === "user"
                                ? "bg-white text-violet-600 shadow-md"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        User
                    </button>
                </div>


                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="
                    w-full
                    border border-gray-300
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                    focus:border-violet-500
                    transition-all
                    "
                    />
                </div>


                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="
                    w-full
                    border border-gray-300
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                    focus:border-violet-500
                    transition-all
                    "
                    />
                </div>


                <button
                disabled={loading}
                className="
                w-full
                bg-gradient-to-r from-violet-600 to-violet-700
                text-white
                py-4
                rounded-xl
                font-semibold
                hover:from-violet-700
                hover:to-violet-800
                transition-all
                shadow-lg
                disabled:opacity-50
                disabled:cursor-not-allowed
                "
                >

                {
                    loading
                    ? "Logging in..."
                    : "Login"
                }

                </button>

                <p className="text-center text-gray-400 text-xs mt-6">
                    Secure login powered by NRK Infotech
                </p>


            </form>


        </div>

    );

}