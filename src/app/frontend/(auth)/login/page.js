"use client";
import "../../../styles/styles.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Page() {
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState();
  const router = useRouter();

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
    setMsg(data.error || data.message);

    if (data.status === 201) {
      localStorage.setItem("vax-login-user", JSON.stringify(data.user));
      if (data.user.role === "superadmin") {
        router.push("/frontend/admin/dashboard");
      } else {
        router.push(`/frontend/health-facility/${data.user.id}/dashboard`);
      }
    }
  }

  const handlePasswordVisible = () => {
    setVisible(!visible);
  };

  console.log(email);

  return (
    <main
   
      className="flex login-cx"
    >
      <div className="ds-bg">
        <h2>
          <strong>Welcome Back </strong>
          Vax Disperser Control
        </h2>
      </div>
      <div className="login-form flex fxd-c">
        <div className="ms-bg"></div>
        <div className="flex fxd-c p-30 p-md-0  input-group gap-20 justify-c align-item-c">
          <div className="flex fxd-c w-full ">
            <h2 className="color-black"></h2>
            <h3 className="color-grey">Login to Continue</h3>
          </div>
          <div className="flex fxd-c w-full p-t-20">
            <label>Username</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex fxd-c w-full">
            <label>Password</label>
            {/* <div className="password-input-cx flex"> */}
            <input
              type={visible ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <Image
              style={{ alignSelf: "flex-end" }}
              onClick={handlePasswordVisible}
              alt="password visibility"
              width={20}
              height={20}
              src={`${visible ? "/visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" : "/visibility_off_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"}`}
            />
            {/* </div> */}
          </div>

          <button
            onClick={handleLogin}
            className="bg-darkblue color-white outline-none border-none border-r-8 p-15 m-t-20 w-50p"
          >
            Login
          </button>
          <div style={{ height: "50px" }} className="p-10">
            {" "}
            {error && <p className="color-red">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
