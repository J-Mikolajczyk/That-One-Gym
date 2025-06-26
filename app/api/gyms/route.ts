import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return new Response(JSON.stringify({ message: "gyms route works" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
