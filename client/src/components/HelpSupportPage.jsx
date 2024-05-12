import React, { useState } from "react";

const HelpSupportPage = () => {
  const [datax, setDatax] = useState([]);

  async function getData() {
    const datax = await fetch("http://localhost:3000/reports");
    const dataxJson = await datax.json();
    setDatax(dataxJson);
  }

  getData();

  return (
    <>
      {datax.map((ipis) => (
        <h1 key={ipis.id}>{ipis.reporter}</h1>
      ))}
    </>
  );
};

export default HelpSupportPage;
