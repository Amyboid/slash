import { login } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const request = await req.json();
  const { username, password } = request;
  const res = await login(username, password);
  // console.log("res", res);

  if (res.status === 200 && res.token) {
    (await cookies()).set({
      name: "session",
      value: res.token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 30,
    });

    return Response.json({ loggedIn: true, user: res.user }, { status: 200 });
  }
  return Response.json(
    { loggedIn: false, error: res.msg },
    { status: res.status || 500 }
  );
}