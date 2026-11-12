import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import PasswordInput from "../../utils/PasswordInput";
import { registration } from "../../backend/backend";
export default function RegistrationPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    async function handleButton() {
        const response = await registration(username, email, password1);
        if(response.status === 201) navigate("/");
    }
    return (
        <>
            <title>DevLog - Registration</title>
            <div className="flex min-h-screen items-center justify-center">
                <div className="
            flex flex-col w-[60%] text-center bg-[rgba(241,235,235,0.54)] rounded-2xl pt-[2%] p-[40px] shadow-lg dark:bg-gray-600
            "
                >
                    <h1 className="text-4xl font-bold mb-[40px] mt-[20px]">DevLog</h1>
                    <h3 className="text-3xl">Registration</h3>
                    <label className="text-left text-2xl mt-[20px] mb-[20px]">Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="transition-all duration-250 ease-in-out text-black border pl-[10px] rounded-2xl border-black py-[15px] placeholder:text-black focus:outline-indigo-600 focus:shadow-lg dark:text-white dark:placeholder:text-white dark:border-white" type="text" placeholder="example@email.com" />
                    <label className="text-left text-2xl mb-[20px]">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="transition-all duration-250 ease-in-out text-black border pl-[10px] rounded-2xl border-black py-[15px] placeholder:text-black focus:outline-indigo-600 focus:shadow-lg dark:text-white dark:placeholder:text-white dark:border-white" type="email" placeholder="example@email.com" />
                    <label className="text-left text-2xl mt-[20px] mb-[20px]">Password</label>
                    <PasswordInput value={password1} onChange={setPassword1} />
                    <label className="text-left text-2xl mt-[20px] mb-[20px]">Password again</label>
                    <PasswordInput value={password2} onChange={setPassword2} />
                    <button onClick={handleButton} className="transition-all duration-250 ease-in-out bg-indigo-800 rounded-2xl text-white font-bold py-[15px] px-[15px] text-1xl mt-[40px] cursor-pointer hover:bg-indigo-600 hover:shadow-lg">Create account</button>
                </div>
            </div>
        </>
    );
}