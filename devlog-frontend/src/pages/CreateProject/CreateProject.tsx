import { useEffect, useState } from "react";
import { connectToGitHub, createProject, loadPorjects } from "../../backend/backend";
import { supabase } from "../../backend/supabase";
import { NavLink, useNavigate } from "react-router";
export default function CreateProjectPage() {
    const navigate = useNavigate();

    const [installed, setInstalled] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);

    interface Repo {
        id: string;
        github_repo_id: number;
        installation_id: number;
        user_id: string;
        project_id: string | null;
        name: string;
        full_name: string;
        private: boolean;
        html_url: string;
    }


    async function handleGitHubButton() {
        await connectToGitHub();
    }

    async function handeProjectCreationButton() {
        const response = await createProject(projectName, description, selectedRepoIds);
        if (response?.status === 201) {
            navigate("/home");
        }
    }


    function toggleRepo(githubRepoId: number) {
        setSelectedRepoIds((prev) =>
            prev.includes(githubRepoId)
                ? prev.filter((id) => id !== githubRepoId)
                : [...prev, githubRepoId]
        );
    }

    useEffect(() => {
        async function fetchRepos() {
            const projectResponse = await loadPorjects();
            if (!projectResponse) return;
            setRepos(projectResponse.selectRepo ?? []);
        }
        fetchRepos();
    }, []);


    return (
        <>
            <title>DevLog - Create project</title>
            <div className="mt-20 pb-10 pt-10 flex flex-col ml-auto mr-auto w-200 text-center items-center dark:bg-[#292828] shadow-2xl">
                <h1 className="text-4xl mb-10">DevLog - Create Project</h1>
                <label className="text-2xl mb-2.5">Project name</label>
                <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="border border-indigo-600 rounded-2xl py-4 px-8 pl-5 w-100" type="text" placeholder="e.g. DevLog" />
                <label className="text-2xl mb-2.5">Project description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" className="w-100 h-30 border pl-5 pt-1 border-indigo-600 rounded-2xl resize-none"></textarea>
                <div>
                    <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-[rgb(76,194,192)] hover:shadow-lg rounded-2xl" to="/home">Go back to home page</NavLink>
                    {installed ? (
                        <button className="transition-all duration-250 ease-in-out ml-5 mr-5 mt-5 py-4 px-8 font-bold border border-green-600 rounded-2xl bg-green-400 cursor-pointer hover:shadow-lg text-black">GitHub Connected!</button>
                    ) : (
                        <button onClick={handleGitHubButton} className="transition-all duration-250 ease-in-out ml-5 mr-5 mt-5 py-4 px-8 font-bold border border-green-600 rounded-2xl hover:bg-green-400 cursor-pointer hover:shadow-lg">Connect GitHub</button>

                    )}
                    <div className="flex flex-col items-start my-4">
                        {repos
                            .filter((repo) => repo.project_id === null)
                            .map((repo) => (
                                <label key={repo.github_repo_id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRepoIds.includes(repo.github_repo_id)}
                                        onChange={() => toggleRepo(repo.github_repo_id)}
                                    />
                                    {repo.full_name}
                                </label>
                            ))}
                    </div>
                    <button onClick={handeProjectCreationButton} className="transition-all duration-250 ease-in-out py-4 px-8 font-bold border border-indigo-600 rounded-2xl hover:bg-indigo-400 cursor-pointer hover:shadow-lg">Create project</button>
                </div>
            </div>
        </>
    );
}