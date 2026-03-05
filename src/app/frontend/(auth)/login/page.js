"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);

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

    setMsg(data.error || data.message);
  }

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/get-users");
      const comment = await res.json()
      console.log(comment)
      setComments(comment)
    }
    loadUsers()
  }, []);

  console.log(comments);

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


      {comments?.map((c,i)=>(<div style={{color:'black'}} key={i}>{c.comment}</div>))}
    </main>
  );
}
