import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import zipcodes from "zipcodes";


export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL as string);
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q')?.trim();
  const zip = searchParams.get('zip')?.trim();
  const radius = searchParams.get('radius')?.trim();
  const equipment = searchParams.get('equipment')?.trim();
  const is247 = searchParams.get('is247')?.trim();
  type ZipObj = { zip: string };

  let zipFilter: string[] = [];
  if (zip && zipcodes.lookup(zip)) {
    const radiusResult = zipcodes.radius(zip, Number(radius));
    if (Array.isArray(radiusResult)) {
      if (typeof radiusResult[0] === "object" && radiusResult[0] !== null && "zip" in radiusResult[0]) {
        zipFilter = (radiusResult as ZipObj[]).map(z => z.zip);
      } else {
        zipFilter = radiusResult as string[];
      }
    } else {
      zipFilter = [];
    }
  }

  let response;

  const hasQuery = query && query.trim() !== '';
  const hasZip = zipFilter && zipFilter.length > 0;
  const hasOtherFilters = is247 || hasQuery || hasZip;

  if (!hasOtherFilters) {
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  let whereClauses = [];

  if (query && query.trim() !== '') {
    const simClause = sql`
      (
        similarity(name, ${query}) > 0.3
        OR similarity(address->>'line1', ${query}) > 0.3
        OR similarity(address->>'city', ${query}) > 0.3
      )
    `;
    whereClauses.push(simClause);
  }

  if (zipFilter && zipFilter.length > 0) {
    const zipClause = sql`address->>'zip' = ANY(${zipFilter})`;
    whereClauses.push(zipClause);
  }

  if (is247) {
    whereClauses.push(sql`is_24_7 = true`);
  }

  let whereSql = sql``;
  if (whereClauses.length > 0) {
    whereSql = sql`WHERE ${whereClauses[0]}`;
    for (let i = 1; i < whereClauses.length; i++) {
      whereSql = sql`${whereSql} AND ${whereClauses[i]}`;
    }
  }

  response = await sql`
    SELECT * FROM gyms
    ${whereSql}
    ${query ? sql`ORDER BY similarity(name, ${query}) DESC` : sql``}
    LIMIT 10;
  `;


  return new Response(JSON.stringify({ response }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

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
    
    const body = await req.json();
    const { gymName, address } = body;

    gymName.trim();
    address.line1.trim();
    address.line2.trim();
    address.city.trim();
    address.state.trim();
    address.zip.trim();

    if (!gymName || !address || !address.line1 || !address.city || !address.state || !address.zip || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sql = neon(process.env.DATABASE_URL as string);
    const response = await sql`
      INSERT INTO gyms (name, address, created_by)
      VALUES (${gymName}, ${address}, ${userId})
      RETURNING id;
    `;

    console.log("Gym added to database:", response);

    if (!response || response.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to add gym" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Gym added successfully", gymName, address }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
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