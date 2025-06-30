import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET( req: NextRequest, context: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL as string);
  
  try {
    const { id } = await context.params;

    const result = await sql`SELECT * FROM gyms WHERE id = ${id}`;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Gym not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching gym:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
