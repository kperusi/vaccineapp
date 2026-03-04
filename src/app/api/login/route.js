'use server'
import { neon } from '@neondatabase/serverless';

export async function POST(request) {

  try {
    const { comment } = await request.json();


    if (!comment || comment.trim() === '') {
      return Response.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO comments (comment)
      VALUES (${comment})
    `;

    return Response.json(
      { message: 'Comment added successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}