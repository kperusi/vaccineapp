import sql from "@/app/lib/db";

export async function POST(req) {
  try {
    const { superAdmin, id } = await req.json();

    console.log(id);

    if (superAdmin.role !== "superadmin") {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
      });
    }

    const r = await sql`SELECT * FROM vaccine_requests WHERE facility_id = ${id}
    AND status='pending'`;
    if (r.length > 0) {
      console.log("there are pending requests");
      await sql` DELETE FROM vaccine_requests WHERE facility_id=${id} AND status= 'pending'`;
    } else {
      console.log("there are no  pending request");
    }
    console.log(r);

    await sql`
     UPDATE facilities SET status='inactive' WHERE id = ${id}
      
    `;

    return new Response(
      JSON.stringify({ message: `facility deleted successfully` }),
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ message: "this vaccine already exists" }),
        {
          status: 409,
        },
      );
    }9

    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
