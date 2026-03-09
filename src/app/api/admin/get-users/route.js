"use server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const users = await sql`
      SELECT * FROM users
    `;

    return Response.json(users);
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
