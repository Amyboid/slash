import { getAllUrls, insertNewUrl } from "@/lib/actions";
import generateShortCode from "@/utils/generateShortCode";

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
  const origin = request.headers.get("origin") + "/" + shortCode
  if (origin === targetUrl) {
    return Response.json({
      status: 400,
      msg: "bad request, use different url than (origin+shortcode 🥴)"
    })
  }
  const data = { targetUrl: targetUrl, shortCode: shortCode };
  const response = await insertNewUrl(data); 
  return Response.json(response);
}

export async function GET(req: Request) {
  const response = await getAllUrls();
  return Response.json(response);
}
