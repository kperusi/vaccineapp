import  sql  from '../../../../lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
console.log(id)
    const facility = await sql`
      SELECT u.name, f.name AS facility, f.id AS facility_id, f.address, f.type,f.capacity,f.email,f.status 
      FROM users u
      JOIN facilities f ON f.id =u.facility_id
      WHERE u.id =${id}

    `;

    if (facility.length === 0) {
      return Response.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }

    return Response.json(facility[0]);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}