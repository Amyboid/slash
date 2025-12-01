import { deleteUrlByCode, getStatsByCode } from "@/lib/actions";

export async function GET(req: Request, { params }: any) {
  let { code } = await params;
  const response = await getStatsByCode(code);
  console.log("stats: ", response);
  return Response.json(response);
}

export async function DELETE(request: Request, { params }: any) {
  const { code } = await params;
  const response = await deleteUrlByCode(code);
  return Response.json(response);
}
