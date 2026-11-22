import { NavLink, useNavigate } from "react-router";
import PasswordInput from "../../utils/PasswordInput";
import { useState } from "react";
import { login } from "../../backend/backend";
import { motion } from "motion/react"

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");

    async function handleButton() {
        if(!email || !password){
            window.alert("Fill every field!");
            return;
        }

        const response = await login(email, password);
        if (response.status === 200) navigate("/home");
    }


    return (
        <>
            <title>DevLog - Login</title>
            <motion.div transition={{type: "spring", duration: 2.5}} initial={{opacity: 0, scaleY: 0, scaleX: 0}} animate={{opacity: 1, scaleY: 1, scaleX: 1}} exit={{opacity: 0, scaleX: 0, scaleY: 0}} className="flex min-h-screen items-center justify-center">
                <motion.div className="
            flex flex-col w-[60%] text-center bg-[rgba(241,235,235,0.54)] rounded-2xl pt-[2%] p-[40px] shadow-lg dark:bg-[#292828]
            "
                >
                    <motion.h1 className="text-4xl font-bold mb-[40px] mt-[20px]">DevLog</motion.h1>
                    <motion.h3 className="text-3xl">Login</motion.h3>
                    <motion.label className="text-left text-2xl mb-[20px]">Email</motion.label>
                    <motion.input value={email} onChange={(e) => setEmail(e.target.value)} className="transition-all duration-250 ease-in-out text-black border pl-[10px] rounded-2xl border-black py-[15px] placeholder:text-black focus:outline-indigo-600 focus:shadow-lg dark:text-white dark:placeholder:text-white dark:border-white" type="email" placeholder="example@email.com" />
                    <motion.div className="mt-[20px] mb-[10px] flex items-center justify-between">
                        <motion.label className="text-2xl">Password</motion.label>
                        <NavLink to="">Forgot password?</NavLink>
                    </motion.div>
                    <PasswordInput value={password} onChange={setPassword} />
                    <motion.button onClick={handleButton} className="transition-all duration-250 ease-in-out bg-indigo-800 rounded-2xl text-white font-bold py-[15px] px-[15px] text-1xl mt-[40px] cursor-pointer hover:bg-indigo-600 hover:shadow-lg">Login</motion.button>
                    <NavLink className="mt-[40px]" to="registration">Don't have an account yet? Create one here!</NavLink>
                </motion.div>
            </motion.div>
        </>
    );
}