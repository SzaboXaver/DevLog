import { NavLink } from "react-router";
import { useState, type ChangeEvent } from "react";

import { register } from "../../backend";

export function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email1, setEmail1] = useState("");
    const [email2, setEmail2] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [result, setResult] = useState("");

    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const passwordMatch = password.length > 0 && password === password2;
    const minimumLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);

    const emailMatch = email1.length > 0 && email1 === email2;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email1);

    const formValid = emailRegex && emailMatch && minimumLength && hasNumber
      && hasUpperCase && hasSpecialChar && passwordMatch && username.length > 0;

    const handleRegister = async () => {
    try {
        const response = await register(username, email1, password);
        setResult(response.data.message);
    } catch (err: any) {
        setResult(err.response?.data?.error ?? "Something went wrong");
    }
};

    return (
        <div id="register-root">
            <h1>DevLog_Registration</h1>

            <label>Username</label>
            <input
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                }
                type="text"
                placeholder="Username"
            />

            <label>Email address once</label>
            <input
                value={email1}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail1(e.target.value)
                }
                type="email"
                placeholder="email@example.com"
            />

            <label>Email address twice</label>
            <input
                value={email2}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail2(e.target.value)
                }
                type="email"
                placeholder="email@example.com"
            />

            <div>
                <p>{emailRegex ? "✓" : "○"} Email in correct format</p>
                <p>{emailMatch ? "✓" : "○"} Emails match</p>
            </div>

            <label>Password once</label>
            <input
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);

                }
                }
                type="password"
                placeholder="Password"
            />

            <label>Password twice</label>
            <input value={password2} onChange={(e) => {
                setPassword2(e.target.value);

            }
            } type="password" placeholder="Password" />

            <div id="row">
                <button>
                    <NavLink to="/">Back to login</NavLink>
                </button>
                <button disabled={!formValid} id="sign-up" onClick={handleRegister}>Sign up</button>
            </div>
            <div>
                <p>{minimumLength ? "✓" : "○"} At least eight letters long</p>
                <p>{hasNumber ? "✓" : "○"} At least one number</p>
                <p>{hasUpperCase ? "✓" : "○"} At least one uppercase letter</p>
                <p>{hasSpecialChar ? "✓" : "○"} At least one special character</p>
                <p>{passwordMatch ? "✓" : "○"} Passwords match</p>
            </div>
            <div id="result-box">
                {result}
            </div>
        </div>
    );
}
