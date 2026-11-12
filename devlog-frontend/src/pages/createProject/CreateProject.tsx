import { useState } from "react";
import { useNavigate } from "react-router";

import './CreateProject.css';
import { createProject } from "../../backend";

export function CreateProject() {
    const navigate = useNavigate();


    const connectGitHub = async () => {
        window.location.href = `
        https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`;
    };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    async function handleCreateProject() {
        const response = await createProject(title, description);

        if (response.data.success) {
            navigate("/home");
        }
    }

    return (
        <div id='addProject-root'>
            <h1>Add new project</h1>
            <label>Project title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='project title' />
            <label>Project description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='description...'></textarea>
            <label>Connect your GitHub repository to this project</label>
            <button onClick={connectGitHub}>Connect GitHub</button>
            <button onClick={handleCreateProject}>Create Project</button>
        </div>
    );
}