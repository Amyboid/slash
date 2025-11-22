import { getAllUrls, insertNewUrl } from "@/app/actions";
import generateShortCode from "@/app/utils/generateShortCode";

export async function POST(request: Request) {
  const req = await request.json();
  let targetUrl = req.targetUrl;
  if (!targetUrl) {
    return Response.json({ error: "no target url provided" });
  }
  let shortCode = req.shortCode;
  if (!shortCode) {
    shortCode = generateShortCode();
  }

  const data = { targetUrl: targetUrl, shortCode: shortCode };
  const response = await insertNewUrl(data);
  console.log("rrs", response);
  return Response.json(response);
}

export async function GET(req: Request) {
  const response = await getAllUrls();
  return Response.json(response);
}
