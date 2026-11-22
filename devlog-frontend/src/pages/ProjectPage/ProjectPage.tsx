import { useEffect } from "react";
import { useLocation } from "react-router";
import { supabase } from "../../backend/supabase";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { createError, updateError } from "../../backend/backend";
import {motion} from "motion/react";

type Commit = {
    sha: string;
    html_url: string;
    commit: { message: string; author: { name: string; date: string } };
    author: { login: string } | null;
};

type TreeItem = {
    path: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
};

type ProjectData = {
    commits: { status: number; data: Commit[] };
    files: { status: number; data: { tree: TreeItem[] } };
};

export default function ProjectPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const data = state?.data as ProjectData[] | undefined;

    const project = data?.[0];
    const commits = project?.commits?.data ?? [];
    const files = project?.files?.data?.tree ?? [];

    interface project {
        id: string;
        user_id: string;
        title: string;
        description: string | null;
        status: string;
        date_of_start: string;
        date_of_done: string | null;
        error_id: string | null;
        repo_id: string | null;
    };


    const [responseData, setResponseData] = useState<project | null>(null);
    const [errorResponse, setErrorResponse] = useState<any[]>([]);

    const [errorName, setErrorName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        async function fetchProject() {
            const { data: response, error } = await supabase.from("projects")
                .select().eq("id", projectId).single();
            if (error || !response) {
                console.error({ status: 500, message: "Error during fetching data", error: error });
                return;
            }
            setResponseData(response);
        }
        fetchProject();
    }, [data]);

    useEffect(() => {
        if (!responseData?.error_id) {
            setErrorResponse([]);
            return;
        }
        async function fetchError() {
            const { data, error } = await supabase
                .from("error")
                .select()
                .eq("project_id", responseData?.id);
            if (error) {
                console.error({ status: 500, message: "Error during fetching data", error });
                return;
            }
            setErrorResponse(data);
        }
        fetchError();
    }, [responseData]);

    useEffect(() => {
        console.log(errorResponse);
    }, [errorResponse]);

    if (!project) return <p>Nincs adat.</p>;
    const projectId = state?.projectId;

    async function handeProjectCreationButton() {
        if(!errorName || !description) {
            window.alert("Fill every field!");
            return;
        }
        const response = await createError(errorName, description, projectId);
        if (response?.status === 201) navigate("/home");
    }
    return (
        <>
            <title>{`DevLog - ${responseData?.title ?? ""}`}</title>
            <motion.div transition={{ type: "spring", duration: 1.5 }} initial={{ opacity: 0, y: "-100px" }} animate={{ opacity: 1, y: "0px" }} className="flex pr-5 pl-5 mt-5 ml-5 mr-5 shadow-xl dark:shadow-white/10 items-center justify-between bg-gray-100 dark:bg-[#292828]">
                <h1 className="text-2xl">DEVLOG - {responseData?.title}</h1>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="">Settings</NavLink>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="/home/createProject">Create project</NavLink>
                <NavLink className="transation-all duration-250 ease-in-out border border-indigo-500 py-4 px-8 hover:text-white font-bold hover:bg-indigo-400 hover:shadow-lg rounded-2xl" to="/home">Home</NavLink>
            </motion.div>
            <div className="flex flex-col mx-auto w-400 mt-10 mb-20 gap-10">
                <motion.div transition={{ type: "spring", duration: 2 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="border border-black dark:border-white flex flex-col gap-2 max-h-96 overflow-y-auto text-center pb-5
                    bg-[#7d81ec] dark:bg-[#1c1f6c]
                    shadow-xl dark:shadow-white/10">
                    <h1 className="text-3xl text-center mt-5 mb-5">About {responseData?.title}</h1>
                    <p>{responseData?.description}</p>
                </motion.div>

                <motion.div transition={{ type: "spring", duration: 2.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="border border-black dark:border-white flex flex-col gap-2 max-h-96 overflow-y-auto
                    bg-[#78e6b5] dark:bg-[#115d2a]
                    shadow-xl dark:shadow-white/10">
                    <h1 className="text-3xl text-center mt-5 mb-5">Commits</h1>
                    {commits.map((c) => (
                        <div className="flex flex-col gap-2" key={c.sha}>
                            <a href={c.html_url} target="_blank" rel="noreferrer">
                                {c.commit.message}
                            </a>
                            <div className="mt-5 mb-5">
                                {c.commit.author.name} ({c.author?.login ?? "ismeretlen"}) -{" "}
                                {new Date(c.commit.author.date).toLocaleString("hu-HU")} -{" "}
                                {c.sha.slice(0, 7)}
                            </div>
                            <hr></hr>
                        </div>
                    ))}
                </motion.div>

                <motion.div transition={{ type: "spring", duration: 3 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="border border-black dark:border-white flex flex-col gap-2 max-h-96 overflow-y-auto
                    bg-gray-300 dark:bg-[#292828]
                    shadow-xl dark:shadow-white/10">
                    <h1 className="text-3xl text-center mt-5 mb-5">Files in this repository</h1>
                    {files.map((f) => (
                        <div className="dark:bg-[#292828]" key={f.sha + f.path}>
                            {f.type === "tree" ? "📁" : "📄"} {f.path}
                            {f.type === "blob" && f.size !== undefined && ` (${f.size} B)`}
                            <hr />
                        </div>
                    ))}
                </motion.div>

                <motion.div transition={{ type: "spring", duration: 3.5 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="border border-black dark:border-white flex flex-col gap-2 max-h-150 overflow-y-auto
                    bg-[#ed7171] dark:bg-[#dd3838]
                    shadow-xl dark:shadow-white/10 pb-5">
                    <h1 className="text-3xl text-center mt-5 mb-5">Errors in the project</h1>
                    {errorResponse ? (errorResponse.map((error: any) => (<div key={error.id}>
                        <div key={error.id} className="flex flex-col gap-4 justify-center">
                            <p className="font-bold">{"Title: " + error.error_title}</p>
                            <p className="font-bold">{"Description: " + error.error_description}</p>
                            <p className="font-bold">{"When appeard: " + error.date_of_error_appearing}</p>
                            <p className="font-bold">{error.date_when_error_got_fixed === null ? "" : "When fixed: " + error.date_when_error_got_fixed}</p>
                            <p className="font-bold">{"Status: " + error.error_status}</p>

                            <button onClick={async () => {
                                if (!error.date_when_error_got_fixed) {
                                    const response = await updateError(error?.id);
                                    if (response?.status === 201) {
                                        window.location.reload();
                                    }
                                }
                            }} className="transition-all duration-250 ease-in-out border border-green-400 hover:bg-green-600 rounded-2xl px-8 py-1 cursor-pointer">{!error.date_when_error_got_fixed ? "Error fixed" : "✅"}</button>
                            <hr />
                        </div>
                    </div>)))

                        : (<></>)}
                </motion.div>
                <motion.div transition={{ type: "spring", duration: 4 }} initial={{ opacity: 0, y:"100px" }} animate={{ opacity: 1, y:"0px" }} className="flex flex-col w-100 mx-auto text-center gap-5">

                    <label className="text-2xl mb-2.5">Error name</label>
                    <input value={errorName} onChange={(e) => setErrorName(e.target.value)} className="border-4 border-red-900 rounded-2xl py-4 px-8 pl-5 w-100" type="text" placeholder="e.g. Fetching error" />
                    <label className="text-2xl mb-2.5">Error description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Fetching error during recieving user data from the backend..." className="w-100 h-30 border-4 pl-5 pt-1 border-red-900 rounded-2xl resize-none"></textarea>
                    <div className="mt-10 flex gap-5">
                        <button onClick={handeProjectCreationButton} className="transition-all mx-auto duration-250 ease-in-out py-4 px-8 font-bold border border-red-900 rounded-2xl hover:bg-red-400 cursor-pointer hover:shadow-lg">Create error</button>
                    </div>

                </motion.div>
            </div>
        </>
    );
}