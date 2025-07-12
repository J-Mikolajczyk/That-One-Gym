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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    
    const emailsql = neon(process.env.DATABASE_URL as string);
    const emailResponse = await emailsql`
      SELECT id FROM users WHERE email = ${req.headers.get("email")};
    `;

    if (!emailResponse || emailResponse.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = emailResponse[0].id;

    const body = await req.json();
    const { name: gymName, address } = body;
    const {is_24_7, power_racks, cable_machines, deadlift_platforms, barbells, dumbbells, treadmills} = body;

    gymName?.trim();
    address.line1?.trim();
    address.line2?.trim();
    address.city?.trim();
    address.state?.trim();
    address.zip?.trim();

    if (!gymName || !address || !address.line1 || !address.city || !address.state || !address.zip) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { line1, line2, city, state, zip } = address;
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/; 
    const cityRegex = /^[a-zA-Z\s]{2,}$/; 
    const stateRegex = /^[A-Z]{2}$/; 
    const zipRegex = /^\d{5}(-\d{4})?$/;

    if (
      !addressRegex.test(line1) ||
      (line2 && !addressRegex.test(line2)) ||
      !cityRegex.test(city) ||
      !stateRegex.test(state) ||
      !zipRegex.test(zip)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid address format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);
    const gymUpdate = await sql`
      UPDATE gyms
      SET name = ${gymName},
          address = ${address},
          updated_by = ${userId},
          is_24_7 = ${is_24_7}
      WHERE id = ${id}
      RETURNING *;
    `;

    const equipmentUpdate = await sql`
      UPDATE gym_equipment_availability
      SET power_racks = ${power_racks},
          cable_machines = ${cable_machines},
          deadlift_platforms = ${deadlift_platforms},
          barbells = ${barbells},
          dumbbells = ${dumbbells},
          treadmills = ${treadmills}
      WHERE gym_id = ${id}
      RETURNING *;
    `;

    if (!gymUpdate.length || !equipmentUpdate.length) {
      return new Response(JSON.stringify({ error: "Update failed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Gym updated successfully", gymName, address }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error updating gym:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update gym" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
