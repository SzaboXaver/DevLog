import { useState } from "react";
import {Eye, EyeOff} from "lucide-react";

export default function PasswordInput({value, onChange}: {
    value: string,
    onChange: (v: string) => void;
}) {
    const [show, setShow] = useState(false);

    return(
        <div className="flex justify-between gap-2">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Password"
                className=" flex-1 transition-all duration-250 ease-in-out text-black border pl-[10px] rounded-2xl border-black py-[15px] placeholder:text-black focus:outline-indigo-600 focus:shadow-lg dark:text-white dark:placeholder:text-white dark:border-white"
            />
            <button 
                type="button"
                onClick={()=>setShow(!show)}
                className={show ? "transition-all duration-250 ease-in-out cursor-pointer bg-green-400 rounded-2xl text-white font-bold py-[15px] px-[20px] hover:shadow-lg" : "transition-all duration-250 ease-in-out cursor-pointer bg-red-400 rounded-2xl text-white font-bold py-[15px] px-[20px] hover:shadow-lg" }
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}