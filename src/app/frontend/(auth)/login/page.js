'use client'

import { useState } from "react";

export default function Page() {
const [comment,setComment]=useState()

  async function handleLogin() {
    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment:comment }),
    });
  }

  //   async function create() {
  //     'use server';
  //     // Connect to the Neon database
  //     const sql = neon(`${process.env.DATABASE_URL}`);
  //     const comment = 'Coming home';
  //     // Insert the comment from the form into the Postgres database
  //   await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  //   }


  console.log(comment)
  return (
    <form>
      <input type="text" placeholder="write a comment" name="comment"  onChange={(e)=>setComment(e.target.value)}/>
      <button onClick={handleLogin}>Submit</button>
    </form>
  );
}
