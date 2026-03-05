"use server";
import { NextResponse } from "next/server";
import sql from "../../../lib/db";
import bcrypt from "bcryptjs";
export async function POST() {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      name VARCHAR(255),
      status VARCHAR(20) DEFAULT 'active',
      last_login TIMESTAMP,
      facility_id INTEGER
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    await sql`
      INSERT INTO users (username,password, email, role,name)
      VALUES (Johnbull123,${passwordHash},johnbull123@gmail.com,superadmin,Johnbull Adams)
    `;

    return NextResponse.json(
      { message: "admin created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
