import { signup } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const request = await req.json();
  const { username, password } = request;
  if (!username || !password) {
    return Response.json({ error: "username or password not provided" });
  }
  const res = await signup(username, password);

  if (res.status === 200 && res.token) {
    (await cookies()).set({
      name: "session",
      value: res.token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    });

    return Response.json(
      { signedUp: true, user: res.user },
      { status: res.status }
    );
  }
  return Response.json(
    { signedUp: false, error: res.msg },
    { status: res.status }
  );
}
