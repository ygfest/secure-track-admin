import React, { useState, useEffect } from "react";
import "../App.css";

const ManagementPage = () => {
  const [cargoDeets, setCargoDeets] = useState([]);

  async function KuninData() {
    const res = await fetch("http://localhost:3000/strack");
    const resJson = await res.json();
    setCargoDeets(resJson);
  }

  KuninData();

  return (
    <>
      {cargoDeets.map((cargo) => (
        <div key={cargo.cargo_id}>
          <h1>{cargo.contents}</h1>
          <h1>{cargo.latitude}</h1>
        </div>
      ))}
    </>
  );
};

export default ManagementPage;
