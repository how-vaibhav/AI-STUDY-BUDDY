import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session to keep auth alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/welcome") &&
    !request.nextUrl.pathname.startsWith("/about") &&
    !request.nextUrl.pathname.startsWith("/contact") &&
    !request.nextUrl.pathname.startsWith("/privacy") &&
    !request.nextUrl.pathname.startsWith("/terms") &&
    !request.nextUrl.pathname.startsWith("/cookies") &&
    !request.nextUrl.pathname.startsWith("/careers") &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}
