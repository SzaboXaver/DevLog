import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { login } from "../../backend";

export function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    async function handleLogin() {
        try {
            const response = await login(email, password);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
        
            navigate("/home");
        }catch {
            setError("Invaild Email or Password!");
        }
    }

    return (
        <>
            <title>Login</title>
            <div id='login-root'>
                <h1>DevLog_Login</h1>
                <label>Email address</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email@example.com" />
                <label>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                <button onClick={handleLogin}>Sign in</button>
                <NavLink to='register'>New around here? Sign up</NavLink>
                <NavLink to=''>Forgot password</NavLink>
            </div>
            <div id="result-box">
                {error}
            </div>
        </>
    );
}