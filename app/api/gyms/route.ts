import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import zipcodes from "zipcodes";

export async function GET(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL as string);
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q')?.trim() || '';
  const zip = searchParams.get('zip')?.trim();
  const radius = searchParams.get('radius')?.trim(); // allowed to be missing/defaulted
  const is247 = searchParams.get('is247')?.trim();

  const featureKeys = ['powerRacks', 'cableMachines', 'deadliftPlatforms', 'barbells', 'dumbbells'];

  const hasEquipmentFilters = featureKeys.some((key) => searchParams.get(key) === 'true');

  // ✅ Early return if no meaningful search criteria
  if (!query && !zip && is247 !== 'true' && !hasEquipmentFilters) {
    return new Response(JSON.stringify({ response: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  function toSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  const equipmentFiltersString = featureKeys
    .filter((key) => searchParams.get(key) === 'true')
    .map((key) => `e.${toSnakeCase(key)} = true`)
    .join(' AND ');

  let zipFilter: string[] = [];
  if (zip && zipcodes.lookup(zip)) {
    const radiusResult = zipcodes.radius(zip, Number(radius));
    if (Array.isArray(radiusResult)) {
      if (typeof radiusResult[0] === 'object' && radiusResult[0] !== null && 'zip' in radiusResult[0]) {
        zipFilter = (radiusResult as { zip: string }[]).map((z) => z.zip);
      } else {
        zipFilter = radiusResult as string[];
      }
    }
  }

  const otherFilters: string[] = [];
  const params: string[] = [];

  if (query !== '') {
    otherFilters.push(`(
      similarity(gyms.name, $${params.length + 1}) > 0.3
      OR similarity(gyms.address->>'line1', $${params.length + 1}) > 0.3
      OR similarity(gyms.address->>'city', $${params.length + 1}) > 0.3
    )`);
    params.push(query);
  }

  if (zipFilter.length > 0) {
    const sanitizedZips = zipFilter.map((z) => `'${z}'`).join(', ');
    otherFilters.push(`gyms.address->>'zip' IN (${sanitizedZips})`);
  }

  if (is247 === 'true') {
    otherFilters.push(`gyms.is_24_7 = true`);
  }

  let whereConditions = otherFilters;
  if (equipmentFiltersString.length > 0) {
    whereConditions.push(equipmentFiltersString);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  const orderByClause = query !== '' ? `ORDER BY similarity(gyms.name, $1) DESC` : '';

  const finalQuery = `
    SELECT gyms.*
    FROM gyms
    JOIN gym_equipment_availability e ON gyms.id = e.gym_id
    ${whereClause}
    ${orderByClause}
    LIMIT 10;
  `;

  const response = await sql.query(finalQuery, params);

  return new Response(JSON.stringify({ response }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
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