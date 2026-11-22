import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { loadData, signOut, loadPorjects, openProject } from "../../backend/backend";
import { motion } from "motion/react";
export default function HomePage() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [userData, setUserData] = useState<any>(null);

    interface Repo {
        id: string;
        github_repo_id: number;
        project_id: string | null;
        name: string;
        full_name: string;
        stargazers_count: number;
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
            setUserData(projectResponse.userData);
        }
        fetchData();
    }, []);

    const stars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
    );

    async function handleSignOut() {
        const response = await signOut();
        if (response.status === 200) navigate("/");
    }

    return (
        <>
            <title>DevLog - Home</title>
            <motion.div transition={{ type: "spring", duration: 1.5 }} initial={{ opacity: 0, y: "-100px" }} animate={{ opacity: 1, y: "0px" }} className="flex pr-5 pl-5 mt-5 ml-5 mr-5 shadow-xl dark:shadow-white/10 items-center justify-between bg-gray-100 dark:bg-[#292828]">
                <h1 className="text-2xl">DEVLOG - Welcome, {userName}!</h1>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="">Settings</NavLink>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="createProject">Create project</NavLink>
                <button onClick={handleSignOut} className="transition-all duration-250 ease-in-out cursor-pointer border border-red-400 py-4 px-8 rounded-2xl font-bold hover:bg-red-300 hover:text-white hover:shadow-lg">Sign out</button>
            </motion.div>

            <motion.div className="flex ml-5 mt-5 mr-5 h-max">
                {userData && (
                    <motion.div transition={{ type: "spring", duration: 1.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex ml-5 mt-5 mr-5 h-max">
                        <img className="rounded-2xl w-30 h-30 shadow-lg dark:shadow-white/10" src={userData.avatar_url} />
                        <div className="flex flex-col w-100 ml-5 border dark:border-white border-black dark:bg-[#292828] bg-gray-100 h-max rounded-2xl mr-5 pl-5 shadow-lg dark:shadow-white/10">
                            <h2 className="text-2xl mb-2">{userData.name}</h2>
                            <p className="bg-green-500 w-max pl-2 pr-2 rounded-2xl mb-2">@{userData.login}</p>
                            <p className="mb-2">{userData.bio}</p>
                            <NavLink to={userData.html_url}>github.com/{userData.login}</NavLink>
                        </div>
                    </motion.div>
                )}
                {userData && (
                    <div className="mt-5">
                        <div className="flex">
                            <motion.div transition={{ type: "spring", duration: 1.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex flex-col w-60 border border-black text-center dark:border-white ml-1 dark:bg-[#292828] bg-gray-100 h-max rounded-2xl mr-1 shadow-lg dark:shadow-white/10">
                                <h3 className="text-2xl">{userData.public_repos}</h3>
                                <h4 className="font-bold">Repositories</h4>
                                <p>Public repositories</p>
                            </motion.div>
                            <motion.div transition={{ type: "spring", duration: 2 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex flex-col w-60 border border-black text-center dark:border-white ml-1 dark:bg-[#292828] bg-gray-100 h-max rounded-2xl mr-1 shadow-lg dark:shadow-white/10">
                                <h3 className="text-2xl">{userData.followers}</h3>
                                <h4 className="font-bold">Followers</h4>
                                <p>People following you</p>
                            </motion.div>
                            <motion.div transition={{ type: "spring", duration: 2.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex flex-col w-60 border border-black text-center dark:border-white ml-1 dark:bg-[#292828] bg-gray-100 h-max rounded-2xl mr-1 shadow-lg dark:shadow-white/10">
                                <h3 className="text-2xl">{userData.following}</h3>
                                <h4 className="font-bold">Following</h4>
                                <p>Following users</p>
                            </motion.div>
                            <motion.div transition={{ type: "spring", duration: 3 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex flex-col w-60 border border-black text-center dark:border-white ml-1 dark:bg-[#292828] bg-gray-100 h-max rounded-2xl mr-1 shadow-lg dark:shadow-white/10">
                                <h3 className="text-2xl">{stars}</h3>
                                <h4 className="font-bold">Stars</h4>
                                <p>Stars acrossing all repositories</p>
                            </motion.div>
                        </div>
                    </div>
                )}
            </motion.div>
            <h2 className="text-4xl mt-10 ml-5">{userName}'s projects</h2>
            <div className="flex gap-5 mt-5 ml-5 mr-5 mb-5">
                {projects.map((project) => (
                    <motion.div transition={{ type: "spring", duration: 1.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="bg-gray-200 rounded-2xl border dark:border-white border-black dark:bg-[#292828] flex flex-col w-70 items-center text-center pt-5 pb-5 pl-5 pr-5 shadow-lg dark:shadow-white/10" key={project.id}>
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
                                    <div key={repo.id} className="flex justify-center">
                                        <button onClick={(async () => {
                                            const response = await openProject(repo.github_repo_id)
                                            if (response.status === 200) navigate("projectPage", { state: { data: response.data, projectId: project.id } });
                                        })} className="cursor-pointer transition-all duration-250 ease-in-out rounded-2xl border font-bold border-green-600 py-2 px-2 hover:bg-green-400 hover:shadow-2xl max-w-60 mt-3">{repo.name}</button>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
}