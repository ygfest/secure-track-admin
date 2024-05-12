import React, { useState, useEffect } from "react";

const ReportsAnalyticsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch("http://localhost:3000/strack");
      const responseJson = await response.json();
      setReports(responseJson);
    }

    fetchReports();
  }, []);

  return (
    <>
      {reports.map((report) => (
        <div key={report.id}>
          <h1>{report.pop_up}</h1>
        </div>
      ))}
    </>
  );
};

export default ReportsAnalyticsPage;
