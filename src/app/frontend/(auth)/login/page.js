"use client";

import { useState } from "react";

export default function Page() {
  const [comment, setComment] = useState();

  const [msg, setMsg] = useState();

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: comment }),
    });
    const data = await response.json();

    setMsg(data.error||data.message);
  }



  console.log(msg);
  return (
    <main>
      <div>
        <input
          type="text"
          placeholder="write a comment"
          name="comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleLogin}>Submit</button>
      </div>
      <p style={{ color: "red" }}>message:{msg}</p>
    </main>
  );
}
