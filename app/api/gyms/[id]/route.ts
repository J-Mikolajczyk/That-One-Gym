import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET( req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL as string);
  
  try {
    const { id } = await params;

    const result = await sql`SELECT * FROM gyms WHERE id = ${id}`;
    const equipmentResult = await sql`SELECT * FROM gym_equipment_availability WHERE gym_id = ${id}`

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Gym not found" }), { status: 404 });
    }

    if (equipmentResult.length === 0) {
      return new Response(JSON.stringify({ error: "Gym equipment results not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({...result[0], ...equipmentResult[0]}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching gym:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

// Add POST request for updating.

export async function POST(req: NextRequest) {
  try {
    const emailsql = neon(process.env.DATABASE_URL as string);
    const emailResponse = await emailsql`
      SELECT id FROM users WHERE email = ${req.headers.get("email")};
    `;

    if (!emailResponse || emailResponse.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const userId = emailResponse[0].id;

    
    
  } catch (error) {
    console.error("Error adding gym:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add gym"}),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}