"use client";

import { useContext, useEffect, useState } from "react";

import "../../../../../styles/styles.css";
import { globalContext } from "../../../../../utils/context/globalContext";
import { useParams, useRouter } from "next/navigation";
import getDay from "../../../../../utils/day";
import getDate from "../../../../../utils/date";

export default function PointDashboard() {
  // const [stock, setStock] = useState([]);
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState();
  const [inventory, setInventory] = useState();
  const { loading, stock, pendingStock, approvedRequest,superAdmin ,fetchFacilities} =
    useContext(globalContext);
  const router = useRouter();
  const [facility, setFacility] = useState([]);
  const [msg, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const res1 = await fetch("/api/admin/get-facilities");
      const facilities = await res1.json();

      const _healthPoint = facilities.find((i) => i.id == id);

      setFacility(_healthPoint);
      console.log(_healthPoint);
      const userRes = await fetch("/api/admin/get-users");
      const users = await userRes.json();
      console.log(users);
      const user = users.find((i) => i.facility_id == _healthPoint.id);
      setUser(user);

      const invRes = await fetch(
        `/api/point/get-facility-inventory/${_healthPoint.id}`,
      );

      const inv = await invRes.json();
      console.log(inv);
      setInventory(inv);
      // if (res1.status === 500) {
      //   setHealthPoints([]);
      // }

      // const res3 = await fetch("/api/get-allocations");
      // const allocations = (await res3.json()) || [];
      // setAllocations(allocations);

      // if (res3.status === 201) {
      //   setLoading(false);
      // }
    }

    loadData();
  }, []);

  const getDaysToExpiry = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/delete-facility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        superAdmin,
        id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Failed to delete facility");
      return;
    }
    console.log(data.status);

    if (data.message.includes("successfully")) {
      setMessage("✅ Facility deleted successfully");
      fetchFacilities()
      router.push("/frontend/admin/points");
    }
  };

  if (loading) {
    return (
      <section
        style={{ width: "70vw", alignSelf: "center", justifySelf: "center" }}
        className="point-loading p-30"
      >
        <div className="wrapper">
          <div className="line  line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
          <div className="line line4"></div>
        </div>
      </section>
    );
  }

  return (
    <main className="dashboard-container flex fxd-c">
      <div className="admin-profile-wrapper">
        {/* 1. TOP HEADER: Global Actions */}
        <div className="flex gap-10 align-item-c p-5"></div>
        <header className="admin-profile-header">
          <div className="header-identity">
            <div></div>

            <div>
              <span
                style={{
                  padding: "0px 5px",
                  backgroundColor: "#4f46e5",
                  textAlign: "center",
                  borderRadius: "2px",
                }}
              >
                {facility.type}
              </span>

              <h1 className="flex fxd-c color-white">{facility?.name}</h1>
              <p className="reduce-gap-0 color-grey-184">
                {facility.email} | {facility.address}
              </p>
            </div>
          </div>
        </header>

        <aside className="admin-card">
          <div className="card-header-flex">
            <h3>Vaccine inventory</h3>
            <button
              className="btn-text"
              onClick={() => router.push("./allocate-vaccine")}
            >
              + Allocate Vaccine
            </button>
          </div>

          <div className="assignment-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vaccine</th>
                  <th>Batch Number</th>
                  <th>Quantity</th>
                  <th>Man. Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>

              <tbody>
                {inventory?.length > 0 &&
                  inventory.map((inv, i) => (
                    <tr key={i}>
                      <td className="text-l">{inv.name}</td>
                      <td className="text-l">{inv.batch_number}</td>
                      <td className="text-l">{inv.quantity}</td>
                      <td className="text-l">
                        {getDay(inv.manufacturer_date)}{" "}
                        {getDate(inv.manufacturer_date)}
                      </td>
                      <td className="text-l">
                        {getDay(inv.expiry_date)} {getDate(inv.expiry_date)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </aside>

        <section className="flex justify-between gap-20">
          <aside className="admin-card security-card w-50p">
            <h3>Contact Staff</h3>
            <div className="status-row">
              <span>Account Status:</span>
              <span className="status-pill active">Active</span>
              <hr style={{ marginTop: "15px" }} />
            </div>

            <div className="data-row">
              <label>Name</label>
              <p>{user?.name}</p>
            </div>
            <div className="data-row">
              <label>Last Login</label>
              <p>
                <strong>{getDay(user?.last_login)}</strong>{" "}
                {getDate(user?.last_login)}
              </p>
            </div>
            <div className="data-row">
              <label>Email</label>
              <p> {user?.email}</p>
            </div>
            <div
              style={{
                alignSelf: "baseline",
                justifySelf: "baseline",
                marginTop: "50px",
                justifyContent: "center",
                alignContent: "center",
                // justifyItems:'center',
                // alignItems:'center',
                verticalAlign: "center",
              }}
              className=""
            >
              <button className="btn-outline-small bg-darkblue">
                Force Password Reset
              </button>
              <button className="btn-outline-small warn">
                Deactivate Account
              </button>
            </div>
          </aside>

          <aside className=" flex fxd-c w-50p">
            <h3 style={{ marginBottom: "2px" }} className="p-l-5">
              Capacity
            </h3>
            <div className="bg-white p-10 admin-card flex fxd-c gap-10">
              <div>
                <p className="color-grey-184"> Capacity</p>
                <p>{facility.capacity}</p>
              </div>
            </div>
            <h3 style={{ marginBottom: "2px" }} className="p-l-5">
              Number of Staff
            </h3>
            <div className="bg-white p-10 admin-card">
              <p className="color-grey-184">Number of Staff</p>
              <p>590</p>
            </div>
            <h3 style={{ marginBottom: "2px" }} className="p-l-5">
              Contacts
            </h3>
            <div className="bg-white p-10 admin-card flex fxd-c gap-10">
              <div>
                <p className="color-grey-184">Email Address</p>
                <p>{facility?.email}</p>
              </div>

              <div>
                <p className="color-grey-184">Phone Number</p>
                <p>{facility?.phone}</p>
              </div>
            </div>
          </aside>
        </section>
        <div className="w-full">
          {/* 2. LEFT COLUMN: Login & Security */}

          {/* 3. MAIN COLUMN: Workload & Assignments */}
          <div className="main-admin-content w-full">
            {/* 4. PERFORMANCE SNIPPET */}
            <section className=" ">
              <div className="flex gap-10 justify-c-end">
                <button className="bg-none cursor-pointer p-5 border-r-5">
                  Edit Health Center Details
                </button>
                <button className="btn-danger" onClick={(e) => handleDelete(e)}>
                  Deactivate Health Center
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
