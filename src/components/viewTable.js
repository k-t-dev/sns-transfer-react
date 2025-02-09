import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver"; // FileSaver.js for downloading files
import { Link } from "react-router-dom"; // Import Link for routing

const ViewTable = () => {
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    // Fetch the data for the mapping table
    const fetchMappings = async () => {
      try {
        const response = await axios.get("http://0.0.0.0:5009/sns_transfer/mappings");
        setMappings(response.data.data || []);
      } catch (error) {
        console.error("Error fetching mappings:", error);
      }
    };

    fetchMappings();
  }, []);

  // Convert data to CSV format
  const downloadCSV = () => {
    const headers = [
      "Instagram ID", 
      "Google Business ID", 
      "Company Name", 
      "Status", 
      "Start Contract Date", 
      "End Contract Date", 
      "Note"
    ];

    const rows = mappings.map(item => [
      item.instagram_id, 
      item.google_business_id, 
      item.company_name, 
      item.status, 
      item.start_contract_date, 
      item.end_contract_date, 
      item.note
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "mapping_data.csv"); // Download the file
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar - Always visible */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Navigation</h3>
        </div>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/update" style={styles.navLink}>Update Mappings</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/view-table" style={styles.navLink}>View Table</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.header}>Mapping Table</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Instagram ID</th>
              <th>Google Business ID</th>
              <th>Company Name</th>
              <th>Status</th>
              <th>Start Contract Date</th>
              <th>End Contract Date</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td>{mapping.instagram_id}</td>
                <td>{mapping.google_business_id}</td>
                <td>{mapping.company_name}</td>
                <td>{mapping.status ? "Active" : "Inactive"}</td>
                <td>{mapping.start_contract_date}</td>
                <td>{mapping.end_contract_date}</td>
                <td>{mapping.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={downloadCSV} style={styles.downloadButton}>Download as CSV</button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    height: "100vh",
    width: "220px",
    backgroundColor: "#2c3e50", // Darker background for the sidebar
    color: "#ecf0f1", // Light text color
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: "20px",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  sidebarTitle: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navList: {
    padding: 0,
    listStyle: "none",
    marginTop: "30px",
    marginBottom: "20px",
  },
  navItem: {
    marginBottom: "15px",
  },
  navLink: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px 20px",
    display: "block",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#34495e",
    }
  },
  mainContent: {
    marginLeft: "220px", // Space for the sidebar
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#ecf0f1", // Lighter background color
    width: "100%",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#34495e",
    color: "#fff",
    padding: "12px 15px",
    textAlign: "left",
  },
  td: {
    padding: "10px 15px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  downloadButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ViewTable;
