import { getUserFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUserFromCookie();

  if (!user) {
    return Response.json({ loggedIn: false });
  }
  return Response.json({ loggedIn: true, username: user?.username });
}
