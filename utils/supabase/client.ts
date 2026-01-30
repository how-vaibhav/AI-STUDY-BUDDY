import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof document === "undefined") return [];
          const cookies = document.cookie.split(";").map((c) => c.trim());
          return cookies.map((cookie) => {
            const [name, value] = cookie.split("=");
            return {
              name,
              value: decodeURIComponent(value || ""),
            };
          });
        },
        setAll(cookiesToSet) {
          if (typeof document === "undefined") return;
          cookiesToSet.forEach(({ name, value, options }) => {
            let cookieString = `${name}=${encodeURIComponent(value)}`;
            if (options?.maxAge) {
              cookieString += `; Max-Age=${options.maxAge}`;
            }
            if (options?.path) {
              cookieString += `; Path=${options.path}`;
            }
            document.cookie = cookieString;
          });
        },
      },
    },
  );
}
