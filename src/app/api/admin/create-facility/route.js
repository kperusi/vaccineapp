export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import sql from '../../../lib/db'

// import { cookies } from "next/headers";

export async function POST(req) {


  try {
    // const role = cookies().get("user_role")?.value;

    const { admin, healtheCenterForm, fullname, adminEmail, password,username } =
      await req.json();
    const { name, address, phone, contact_staff, email, capacity, type } =
      healtheCenterForm;
    
    // Admin-only
    if (admin.role !== "superadmin") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    if (!name || !adminEmail || !address) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 },
      );
    }

    const [health_center] = await sql`
      INSERT INTO facilities (name,
        address,
        phone,
        email,
        capacity,
        type,
        contact_staff,
        status)
      VALUES (${name},${address}, ${phone}, ${email}, ${capacity},${type},${contact_staff},'active')
    RETURNING id
      `;

    const passwordHash = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (username,name, email, password, role,facility_id)
      VALUES (${username},${fullname}, ${adminEmail}, ${passwordHash}, 'facility admin',${health_center.id})
    `;

    return new Response(
      JSON.stringify({ message: `${name} facility  created successfully and user added` }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ message: "this email already exists" }),
        {
          status: 409,
        },
      );
    }

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
