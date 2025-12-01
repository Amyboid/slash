import {
  getRedirectUrl,
  getRedirectUrlFromCache,
  incrementClicks,
  isRedirectUrlExistInCache,
  setRedirectUrlToCache,
} from "@/lib/actions";

export async function GET(req: Request, { params }: any) {
  const { code } = await params;
  try {
    incrementClicks(code);
    if (await isRedirectUrlExistInCache(code)) {
      const target = (await getRedirectUrlFromCache(code)) || "";
      console.log("target in cache: ", target);
      
      return Response.redirect(target, 302);
    }

    const rows = await getRedirectUrl(code);
    console.log("redirct url by code: ", rows);
    
    const target = rows[0];
    console.log("target: ", target);
    setRedirectUrlToCache(code, target);
    try {
      new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid target" }), {
        status: 500,
      });
    }
    return Response.redirect(target, 302);
  } catch (error) {
    console.log("Redirect error: ",error);
    
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
