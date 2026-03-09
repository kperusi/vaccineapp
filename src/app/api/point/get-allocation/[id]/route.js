import  sql  from '../../../../lib/db';
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
 const { id } = await params;

  try {
    const allocations = await sql`
    SELECT 
    va.id,
    SUM(va.quantity_allocated) AS total_received,
    va.notes,
    va.allocation_date,
    vt.name AS vaccine_name,
    inv.batch_number
    FROM vaccine_allocations va
    JOIN inventory inv ON inv.id = va.inventory_id
    JOIN vaccine_types vt ON vt.id = inv.vaccine_type_id
    WHERE va.facility_id =${id}
    GROUP BY va.id,vt.name,inv.batch_number
    `;

    // console.log("point-inventory", inventory);
    return NextResponse.json(allocations, { status: 201 });

  } catch (error) {
    console.error("Get user facility allocations error", error);
    return NextResponse.json([
      { error: "Failed to fetch facility allocations " },
      { status: 500 },
    ]);
  }
}
