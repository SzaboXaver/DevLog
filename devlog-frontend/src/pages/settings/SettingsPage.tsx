import { useState } from 'react';
import './SettingsPage.css';
import { NavLink } from 'react-router';

export function SettingsPage() {
    const [theme, setTheme] = useState("dark");
    const buttonText = theme === "dark" ? "switch to light theme" : "switch to dark theme";
    const buttonClass = theme === "dark" ? "darkBtn" : "lightBtn";

    function handleButton() {
        setTheme(theme === "dark" ? "light" : "dark");
    }
    
    return(
        <div id='settings-box'>
            <h1>Settings</h1>
            <NavLink id='navlink' to="/home">Return</NavLink>
            <h3>Theme: {theme}</h3>
            <button className={buttonClass} onClick={handleButton}>{buttonText}</button>
            <h3>Log out</h3>
            <button id='logoutBtn'>Log out from this account!</button>
            <h3>Delete account</h3>
            <button id='deleteBtn'>Delete this account!</button>
        </div>
    );
}