import { useEffect, useState } from "react";
import "./HomePage.css";
import { NavLink } from "react-router";

import { loadProfile } from "../../backend";

export function HomePage() {
    type Profile = {
        id: string,
        username: string,
        description: string,
        date_when_profile_created: string,
        site_theme: string
    };

    const [userData, setUserData] = useState<Profile | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await loadProfile();
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <title>Home</title>

            <div id="user-row">
                <h2>{userData?.username}</h2>
                <p>ID: {userData?.id}</p>
                <p>Date of account creation: {userData?.date_when_profile_created}</p>
                <p>Status: Active</p>
                <NavLink id="navlink" to="settings">Settings</NavLink>
            </div>
        </>
    );
}