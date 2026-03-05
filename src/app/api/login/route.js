"use server";
import sql from "../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password required" }),
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, name, email, password, role,username
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    await sql` UPDATE users SET last_login= NOW()
WHERE id=${user.id}
`;

    return Response.json({
      message:'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        userName: user.username,
      },
      status:201
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return new Response(
      JSON.stringify({
        error: err?.message,
        name: err?.name,
        code: err?.code,
        detail: err?.detail,
      }),
      { status: 500 },
    );
  }
}

// try {
//   const { comment } = await request.json();

//   if (!comment || comment.trim() === '') {
//     return Response.json(
//       { error: 'Comment is required' },
//       { status: 400 }
//     );
//   }

//   const sql = neon(process.env.DATABASE_URL);

//   await sql`
//     INSERT INTO comments (comment)
//     VALUES (${comment})
//   `;

//   return Response.json(
//     { message: 'Comment added successfully' },
//     { status: 201 }
//   );

// } catch (error) {
//   console.error(error);

//   return Response.json(
//     { error: 'Internal server error' },
//     { status: 500 }
//   );
// }
