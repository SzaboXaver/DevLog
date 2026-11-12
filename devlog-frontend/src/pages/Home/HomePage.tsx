import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { loadData, signOut, loadPorjects } from "../../backend/backend";
export default function HomePage() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [repos, setRepos] = useState<Repo[]>([]);

    interface Repo {
        id: string;
        github_repo_id: number;
        project_id: string | null;
        name: string;
        full_name: string;
    }

    interface Project {
        date_of_done: string | null;
        date_of_start: string;
        description: string;
        error_id: string | null;
        id: string;
        status: string;
        title: string;
        user_id: string;
    }

    useEffect(() => {
        async function fetchData() {
            const response = await loadData();
            setUserName(response?.username);
            const projectResponse = await loadPorjects();
            if (!projectResponse) return;

            setProjects(projectResponse.selectProject);

            setRepos(projectResponse.selectRepo);

            console.log(projectResponse.selectRepo);

        }
        fetchData();
    }, []);

    async function handleSignOut() {
        const response = await signOut();
        if (response.status === 200) navigate("/");
    }

    return (
        <>
            <title>DevLog - Home</title>
            <div className="flex pr-5 pl-5 mt-5 ml-5 mr-5 shadow-xl items-center justify-between bg-gray-100 dark:bg-[#292828]">
                <h1 className="text-2xl">DEVLOG - Welcome, {userName}!</h1>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="">Settings</NavLink>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="createProject">Create project</NavLink>
                <button onClick={handleSignOut} className="transition-all duration-250 ease-in-out cursor-pointer border border-red-400 py-4 px-8 rounded-2xl font-bold hover:bg-red-300 hover:text-white hover:shadow-lg">Sign out</button>
            </div>
            <h2 className="text-4xl mt-10 ml-5">{userName}'s projects</h2>
            <div className="flex gap-5 mt-5 ml-5 mr-5 mb-5">
                {projects.map((project) => (
                    <div className="bg-gray-200 dark:bg-[#292828] flex flex-col w-70 items-center text-center pt-5 pb-5 pl-5 pr-5 shadow-lg" key={project.id}>
                        <h3 className="text-3xl">Project: {project.title}</h3>
                        <p className="text-2xl">Description: </p>
                        <p>{project.description}</p>
                        <p className="text-2xl">Project status: </p>
                        <p>{project.status}</p>
                        <p className="text-2xl">Started: </p>
                        <p>{project.date_of_start}</p>
                        <p className="text-2xl">GitHub repositories</p>
                        <div>
                            {repos
                                .filter((repo) => repo.project_id === project.id)
                                .map((repo) => (
                                    <div key={repo.id}>
                                        <p>{repo.name}</p>
                                    </div>
                                ))}
                        </div>
                        <NavLink className="transition-all duration-250 ease-in-out rounded-2xl border font-bold border-indigo-600 py-4 px-8 hover:bg-indigo-400 hover:shadow-2xl" to="">Open project: {project.title}</NavLink>
                    </div>
                ))}
            </div>
        </>
    );
}