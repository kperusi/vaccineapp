"use server";
import { NextResponse } from "next/server";
import sql from "../../../lib/db";
import bcrypt from "bcryptjs";
export async function POST() {
  try {
    const passwordHash = await bcrypt.hash("123456", 10);
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      name VARCHAR(255),
      phone VARCHAR(20),
      status VARCHAR(20) DEFAULT 'active',
      last_login TIMESTAMP,
      facility_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    const username = "Johnbull123";
    const email = "johnbull123@gmail.com";
    const role = "superadmin";
    const name = "Johnbull Adams";
    const phone='07066754322';

    await sql`
  INSERT INTO users (username, password, email, role, name,phone)
  VALUES (${username}, ${passwordHash}, ${email}, ${role}, ${name},${phone})
`;

    return NextResponse.json(
      { message: "admin created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
