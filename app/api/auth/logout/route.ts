import { cookies } from "next/headers";

export async function GET() {
  (await cookies()).set("session", "");
  return Response.json({ loggedOut: true });
}
