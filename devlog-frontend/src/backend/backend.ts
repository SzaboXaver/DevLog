import axios from "axios";
import { supabase } from "./supabase";
import dayjs from "dayjs";

export async function registration(username: string, email: string, password: string) {
    try {
        const { error } = await supabase.auth.signUp(
            {
                email,
                password,
                options: {
                    data: {
                        username
                    }
                }
            }
        );
        if (error) throw error;
        return { status: 201 };
    } catch (error: any) {
        return error;
    }
}

export async function login(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return { status: 200 };
    } catch (error: any) {
        return error;
    }
}

export async function loadData() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user?.id)
        .maybeSingle();

    if (error) throw error;

    const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select()
        .eq("user_id", user?.id);

    if (projectError) throw projectError;

    return { username: data?.username, projects: projectData };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
    return { status: 200 };
}

export async function connectToGitHub() {
    const { data, error } = await supabase.auth.getSession();
    if (!data || error) console.error("No authenticated user", error);
    const userToken = data.session?.access_token;

    const response = await axios.get("http://localhost:3000/api/github/install-url", {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });

    console.log(response.data);

    const url = response.data.url;
    window.location.href = url;
}

export async function createProject(title: string, description: string, repoIds: number[] = []) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("User not authenticated");

  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      description,
      date_of_start: dayjs().format("YYYY-MM-DD"),
      status: "in progress",
    })
    .select("id")
    .single();
  if (insertError) throw insertError;

    

  if (repoIds.length > 0) {
    const { error: repoError } = await supabase
      .from("repositories")
      .update({ project_id: project.id })
      .in("github_repo_id", repoIds)
      .eq("user_id", user.id);
    if (repoError) throw repoError;
  }

  return { status: 201, projectId: project.id };
}

export async function loadPorjects() {

    const { data, error } = await supabase.auth.getSession();
    if (!data || error) console.error("No authenticated user", error);
    const userToken = data.session?.access_token;

    const response = await axios.get("http://localhost:3000/api/github/loadRepositories", {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    return response.data;
}