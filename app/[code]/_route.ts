// import { incrementClicks } from "@/lib/actions";

// export async function GET(req: Request, { params }: any) {
//   const { code } = await params;
//   console.log("code:", code);

//   try {
//     const rows = await incrementClicks(code);
//     if (!rows || rows.length === 0) {
//       return new Response(JSON.stringify({ error: "Not found" }), {
//         status: 404,
//       });
//     }

//     const target = rows[0].target;
//     console.log("target: ", target);
//     try {
//       new URL(target);
//     } catch {
//       return new Response(JSON.stringify({ error: "Invalid target" }), {
//         status: 500,
//       });
//     }
//     return Response.redirect(target, 302);
//   } catch (error) {
//     console.log(error);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }
