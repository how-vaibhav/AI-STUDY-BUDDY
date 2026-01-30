import { createClient } from "@/utils/supabase/client";
import bcrypt from "bcryptjs";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signUp(email: string, password: string) {
  try {
    // Create user in Supabase auth
    const client = getSupabase();
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Sign up error:", authError);
      return { error: authError.message };
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("Sign up exception:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const client = getSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return { error: error.message };
    }

    // Ensure session is properly set
    if (data.session) {
      // Session is automatically managed by Supabase SSR client
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Sign in exception:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function signOut() {
  try {
    const client = getSupabase();
    return await client.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getCurrentUser() {
  try {
    const client = getSupabase();
    const {
      data: { user },
    } = await client.auth.getUser();
    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function refreshSession() {
  try {
    const client = getSupabase();
    const {
      data: { session },
    } = await client.auth.refreshSession();
    return session;
  } catch (error) {
    console.error("Refresh session error:", error);
    return null;
  }
}
