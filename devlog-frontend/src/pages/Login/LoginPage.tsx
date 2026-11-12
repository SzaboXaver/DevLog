import { NavLink, useNavigate } from "react-router";
import PasswordInput from "../../utils/PasswordInput";
import { useState } from "react";
import { login } from "../../backend/backend";
export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");

    async function handleButton() {
        const response = await login(email, password);
        if(response.status === 200) navigate("/home");
    }
    
    return (
        <>
            <title>DevLog - Login</title>
            <div className="flex min-h-screen items-center justify-center">
                <div className="
            flex flex-col w-[60%] text-center bg-[rgba(241,235,235,0.54)] rounded-2xl pt-[2%] p-[40px] shadow-lg dark:bg-gray-600
            "
                >
                    <h1 className="text-4xl font-bold mb-[40px] mt-[20px]">DevLog</h1>
                    <h3 className="text-3xl">Login</h3>
                    <label className="text-left text-2xl mb-[20px]">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="transition-all duration-250 ease-in-out text-black border pl-[10px] rounded-2xl border-black py-[15px] placeholder:text-black focus:outline-indigo-600 focus:shadow-lg dark:text-white dark:placeholder:text-white dark:border-white" type="email" placeholder="example@email.com" />
                    <div className="mt-[20px] mb-[10px] flex items-center justify-between">
                        <label className="text-2xl">Password</label>
                        <NavLink to="">Forgot password?</NavLink>
                    </div>
                    <PasswordInput value={password} onChange={setPassword} />
                    <button onClick={handleButton} className="transition-all duration-250 ease-in-out bg-indigo-800 rounded-2xl text-white font-bold py-[15px] px-[15px] text-1xl mt-[40px] cursor-pointer hover:bg-indigo-600 hover:shadow-lg">Login</button>       
                    <NavLink className="mt-[40px]" to="registration">Don't have an account yet? Create one here!</NavLink>
                </div>
            </div>
        </>
    );
}