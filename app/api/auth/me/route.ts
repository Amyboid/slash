import { getUserFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUserFromCookie();
  // console.log("user", user?.username);

  if (!user) {
    return Response.json({ loggedIn: false });
  }
  return Response.json({ loggedIn: true, username: user?.username });
}
