"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import "../../globals.css";
import "../../styles/styles.css";
// import { useState } from "react";
import { globalContext } from "../../utils/context/globalContext";
import Link from "next/link";

export default function Layout({ children }) {
  const [stock, setStock] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [savedUser, setSavedUser] = useState("");
  // const { user, setUser } = useContext(globalContext);

  const [facility, setFacility] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState([]);
  const [pendingRequest, setPendingRequests] = useState([]);
  const [rejectedRequest, setRejectedRequest] = useState([]);
  const [request, setRequest] = useState([]);
  const params = useParams();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("inventory")) return " Available Vaccine Types";
    if (pathname.includes("requests")) return "Vaccine Requests";
    if (pathname.includes("reports")) return "Reports";
    if (pathname.includes("points")) return "Health Centers";
  };
  const today = new Date();

  const weekDay = today.toLocaleDateString("en-US", { weekday: "long" }); // "Saturday"
  // date.toLocaleDateString("en-US", { weekday: "short" }); // "Sat"
  const todayDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function loadUser() {
      const localUser = await JSON.parse(
        localStorage.getItem("vax-login-user"),
      );
      setSavedUser(localUser);
    }
    loadUser();
  }, []);

  async function fetchRequests() {
    const data = facility;
    const res2 = await fetch(`/api/point/get-request/${data.facility_id}/all`);
    const data2 = await res2.json();
    setRequest(data2);

    const pendingRes = await fetch(
      `/api/point/get-request/${data.facility_id}/pending`,
    );
    const pData = await pendingRes.json();
    setPendingRequests(pData);
    console.log(pData);

    await fetch(`/api/point/get-request/${data.facility_id}/approved`)
      .then((res) => res.json())
      .then(approvedRequest);

    await fetch(`/api/point/get-request/${data.facility_id}/rejected`)
      .then((res) => res.json())
      .then(rejectedRequest);
  }

  useEffect(() => {
    console.log(savedUser.id);
    async function fetchFacility() {
      const res = await fetch(`/api/point/get-facility/${params.id}`);
      const data = await res.json();
      console.log(data);

      if (data) {
        setFacility(data);

        await fetch(`/api/point/get-facility-inventory/${data.facility_id}`)
          .then((res) => res.json())
          .then(setStock)
          .then(setLoading(false));

        const allocationRes = await fetch(
          `/api/point/get-allocation/${data.facility_id}`,
        );
        const data2 = await allocationRes.json();
        setAllocations(data2);
      }

      const res2 = await fetch(
        `/api/point/get-request/${data.facility_id}/all`,
      );
      const data2 = await res2.json();
      setRequest(data2);

      const pendingRes = await fetch(
        `/api/point/get-request/${data.facility_id}/pending`,
      );
      const pData = await pendingRes.json();
      setPendingRequests(pData);
      console.log(pData);

      await fetch(`/api/point/get-request/${data.facility_id}/approved`)
        .then((res) => res.json())
        .then(approvedRequest);

      await fetch(`/api/point/get-request/${data.facility_id}/rejected`)
        .then((res) => res.json())
        .then(rejectedRequest);

      if (data[2]?.status === 201) {
        setLoading(false);
      }
    }
    fetchFacility();
  }, [facility?.id, params.id]);

  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const handleLogout = () => {
    localStorage.removeItem("vax-login-user");
    // setUser("");
    router.push("/frontend/login");
  };

  useEffect(() => {
    fetch("/api/get-vaccines")
      .then((res) => res.json())
      .then(setVaccines);
  }, []);

  // console.log(pendingRequest);

  return (
    <main className="dashboard">
      <globalContext.Provider
        value={{
          facility: facility,
          allocations: allocations,
          loading: loading,
          stock: stock,
          request: request,
          pendingRequest: pendingRequest,
          approvedRequest: approvedRequest,
          rejectedRequest: rejectedRequest,
          approvedRequest: approvedRequest,
          fetchRequests:fetchRequests
        }}
      >
        <aside className="sidebar">
          <h2 className="logo">Vax National Vaccines</h2>

          <nav>
            <Link href={`/frontend/health-facility/${params?.id}/dashboard`}>
              Dashboard
            </Link>

            <Link
              href={`/frontend/health-facility/${params.id}/point-inventory`}
            >
              Available Vaccines
            </Link>
            <Link
              href={`/frontend/health-facility/${params.id}/request-vaccine`}
            >
              Request Vaccine
            </Link>
            {/* <Link href="/points/available-vaccine">Record Usage</Link>
            <Link href="/points/reports">Usage History</Link>
            <Link href="/points/reports">expiry Alerts</Link> */}
          </nav>

          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </aside>

        <section className="w-full">
          <header className="header p-l-r-30 p-t-30">
            <div>
              <h1 style={{ marginBottom: "0px" }}>{facility?.facility}</h1>
              <h3 className="reduce-gap-10">
                <span style={{ color: "grey" }}>Facility Administrator</span>{" "}
                <strong>{getTitle()}</strong> |{" "}
                <span className="reduce-gap-15">
                  {" "}
                  <strong style={{ color: "red" }}>{weekDay}, </strong>
                  <span style={{ color: "gray" }}>{todayDate}</span>
                </span>
              </h3>
            </div>

            <div
              style={{ alignContent: "center" }}
              className="flex gap-10 justify-c"
            >
              <div className="admin-badge">
                {facility?.name.split(" ")[0]?.slice(0, 1).toUpperCase()}
                {facility?.name.split(" ")[1]?.slice(0, 1).toUpperCase()}{" "}
              </div>
              <span className="text-c ">{facility?.name}</span>
            </div>
          </header>

          <section className="content">{children}</section>
        </section>
      </globalContext.Provider>
    </main>
  );
}

// import "../admin/styles/adminstyles.css";
