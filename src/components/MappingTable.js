import React, { useState, useEffect } from "react";
import "./MappingTable.css";
import axios from "axios";
import { Link } from 'react-router-dom';

const MappingTable = () => {
  const [mappings, setMappings] = useState([]);
  const [updatedMappings, setUpdatedMappings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMapping, setNewMapping] = useState({
    instagram_id: "",
    google_business_id: "",
    company_name: "",
    status: true,
    start_contract_date: "",
    end_contract_date: "",
    note: "",
  });
  const [deleteId, setDeleteId] = useState(""); // State for delete input

  // Fetch mappings data from the server
  const fetchMappings = async () => {
    try {
      const response = await axios.get("https://68bl3ura19.execute-api.ap-northeast-1.amazonaws.com/dev/mappings");
      setMappings(response.data.data || []);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  // Fetch mappings when the component mounts
  useEffect(() => {
    fetchMappings();
  }, []);

  // Sort function
  const sortMappings = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...mappings].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setMappings(sortedData);
    setSortConfig({ key, direction });
  };



const toggleStatus = (id) => {
  const currentStatus =
    updatedMappings[id]?.status !== undefined
      ? updatedMappings[id].status
      : mappings.find((mapping) => mapping.id === id)?.status;

  if (currentStatus !== undefined) {
    const newStatus = !currentStatus;

    setUpdatedMappings((prevMappings) => ({
      ...prevMappings,
      [id]: {
        ...(prevMappings[id] || {}),
        status: newStatus,
        clicked: true,
      },
    }));
  } else {
    console.error("Status is undefined for mapping with id:", id);
  }
};


const getButtonStyle = (id) => {
  const currentStatus =
    updatedMappings[id]?.status !== undefined
      ? updatedMappings[id].status
      : mappings.find((mapping) => mapping.id === id)?.status;

  // Set initial colors (green for active, red for inactive)
  let backgroundColor;
  if (currentStatus === true) {
    backgroundColor = "green"; // Active
  } else if (currentStatus === false) {
    backgroundColor = "red"; // Inactive
  } else {
    backgroundColor = "gray"; // Default if undefined
  }

  // If the button was clicked (toggled), make it orange
  if (updatedMappings[id]?.clicked) {
    backgroundColor = "orange";
  }

  return {
    backgroundColor: backgroundColor,
    color: "white", // Button text color
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  };
};

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMapping({ ...newMapping, [name]: value });
  };

  const handleDeleteInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  const addNewMapping = async () => {
    setIsSubmitting(true);
    try {
      console.log("Saving new mapping:", newMapping);
      
      // Make the POST request to the server to add the new mapping
      const response = await axios.post("https://68bl3ura19.execute-api.ap-northeast-1.amazonaws.com/dev/add_account", newMapping);
  
      if (response.status === 200) {
        alert("New mapping added successfully!");
        // Reset the new mapping form after successful addition
        setNewMapping({
          instagram_id: "",
          google_business_id: "",
          company_name: "",
          status: true,
          start_contract_date: "",
          end_contract_date: "",
          note: "",
        });
        // Optionally, you can fetch the updated list of mappings
        await fetchMappings();
        
      } else {
        alert("Failed to add new mapping. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add new mapping", error);
      alert("An error occurred while adding the new mapping. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const deleteMapping = async () => {
    if (!deleteId) {
      alert("Please enter a valid Instagram ID.");
      return;
    }

    setIsSubmitting(true); // Show loading state

    try {
      console.log("Deleting mapping with Instagram ID:", deleteId);

      const response = await axios.post("https://68bl3ura19.execute-api.ap-northeast-1.amazonaws.com/dev/delete_account", {
        mapping_id: deleteId,
      });

      if (response.status === 200) {
        alert(`Mapping with Instagram ID: ${deleteId} deleted successfully!`);
        await fetchMappings();
       // Remove the deleted mapping from the local state
       setMappings((prevMappings) => prevMappings.filter((mapping) => mapping.instagram_id !== deleteId));
      setDeleteId(""); // Clear the input field
    } else {
      alert("Failed to delete the mapping. Please try again.");
    }

    } catch (error) {
      console.error("Failed to delete mapping", error);
      // Check if the error response contains the expected message
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail); // Show the specific error message from the server
      } else {
        alert("An error occurred while deleting the mapping. Please try again.");
    }
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyChanges = async () => {
    setIsSubmitting(true);
    try {
      const updatedMappingsDict = mappings.reduce((acc, mapping) => {
        const updatedMapping = updatedMappings[mapping.id];
        if (updatedMapping) {
          acc[mapping.id] = {
            ...mapping,
            instagram_id: updatedMapping.instagram_id || mapping.instagram_id,
            google_business_id: updatedMapping.google_business_id || mapping.google_business_id,
            company_name: updatedMapping.company_name || mapping.company_name,
            start_contract_date: updatedMapping.start_contract_date || mapping.start_contract_date,
            end_contract_date: updatedMapping.end_contract_date || mapping.end_contract_date,
            note: updatedMapping.note || mapping.note,
            status: updatedMapping.status !== undefined ? updatedMapping.status : mapping.status,
          };
        }
        return acc;
      }, {});

      console.log("Payload being sent to the server:", {
        mapping_id: 1,
        updates: { updatedMappingsDict },
      });

      const response = await axios.post("https://68bl3ura19.execute-api.ap-northeast-1.amazonaws.com/dev/update_status", {
        updates: updatedMappingsDict,
      });

      console.log("response", response.status);

      if (response.status === 200) {
        alert("All changes applied successfully!");
        // Reset updatedMappings to clear the changed background colors
        setUpdatedMappings({});
        // Fetch the latest mappings data after applying changes
        await fetchMappings();
      }
    } catch (error) {
      console.error("Failed to apply changes", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCellChange = (id, field, value) => {
    setUpdatedMappings((prevMappings) => ({
      ...prevMappings,
      [id]: {
        ...prevMappings[id],
        [field]: value,
      },
    }));
  };

  // Fixed logic to apply style only to the changed cell
  const getCellStyle = (id, field, originalValue) => {
    const updatedValue = updatedMappings[id]?.[field];
    return updatedValue !== undefined && updatedValue !== originalValue
      ? { backgroundColor: "orange" }  // Changed value gets the background color
      : {};
  };


  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar - Always visible */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>目次</h3>
        </div>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/update" style={styles.navLink}>契約の編集</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/view-table" style={styles.navLink}>最新の契約</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2>アカウントの追加</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewMapping();
          }}
        >
          {/* Add New Mapping form fields */}
          <div className="form-group">
            <label>Instagram ID:</label>
            <input
              type="text"
              name="instagram_id"
              value={newMapping.instagram_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Google Business ID:</label>
            <input
              type="text"
              name="google_business_id"
              value={newMapping.google_business_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>会社名/店舗名:</label>
            <input
              type="text"
              name="company_name"
              value={newMapping.company_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>契約開始日:</label>
            <input
              type="date"
              name="start_contract_date"
              value={newMapping.start_contract_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>契約終了日:</label>
            <input
              type="date"
              name="end_contract_date"
              value={newMapping.end_contract_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>備考:</label>
            <textarea
              name="note"
              value={newMapping.note}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Mapping"}
          </button>
        </form>

        <h2>アカウント削除</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            deleteMapping();
          }}
        >
          {/* Delete Mapping form */}
          <div className="form-group">
            <label>Instagram ID を入力してアカウントを削除してください:</label>
            <input
              type="text"
              value={deleteId}
              onChange={handleDeleteInputChange}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Deleting..." : "Delete Mapping"}
          </button>
        </form>

        <h2>アカウント情報の編集</h2>
        {mappings.length > 0 ? (
          <table className="mapping-table">
            <thead>
              <tr>
                <th>Instagram ID</th>
                <th>Google Business ID</th>
                <th>会社名/店舗名</th>
                <th>契約開始日</th>
                <th>契約終了日</th>
                <th>備考</th>
                <th>ステータス</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td>
                    <input
                      type="text"
                      value={updatedMappings[mapping.id]?.instagram_id || mapping.instagram_id}
                      onChange={(e) => handleCellChange(mapping.id, "instagram_id", e.target.value)}
                      style={getCellStyle(mapping.id, "instagram_id", mapping.instagram_id)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedMappings[mapping.id]?.google_business_id || mapping.google_business_id}
                      onChange={(e) => handleCellChange(mapping.id, "google_business_id", e.target.value)}
                      style={getCellStyle(mapping.id, "google_business_id", mapping.google_business_id)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updatedMappings[mapping.id]?.company_name || mapping.company_name}
                      onChange={(e) => handleCellChange(mapping.id, "company_name", e.target.value)}
                      style={getCellStyle(mapping.id, "company_name", mapping.company_name)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={updatedMappings[mapping.id]?.start_contract_date || 
                        mapping.start_contract_date.slice(0, 10) // Ensure to take only the date part (YYYY-MM-DD)
                      }
                      onChange={(e) => handleCellChange(mapping.id, "start_contract_date", e.target.value)}
                      style={getCellStyle(mapping.id, "start_contract_date", mapping.start_contract_date)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={updatedMappings[mapping.id]?.end_contract_date || 
                        mapping.end_contract_date.slice(0, 10) // Ensure to take only the date part (YYYY-MM-DD)
                      }
                      onChange={(e) => handleCellChange(mapping.id, "end_contract_date", e.target.value)}
                      style={getCellStyle(mapping.id, "end_contract_date", mapping.end_contract_date)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={updatedMappings[mapping.id]?.note || mapping.note}
                      onChange={(e) => handleCellChange(mapping.id, "note", e.target.value)}
                      style={getCellStyle(mapping.id, "note", mapping.note)}
                    ></textarea>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(mapping.id)}
                      style={getButtonStyle(mapping.id)}
                    >
                      {/* {updatedMappings[mapping.id]?.status || mapping.status ? "Active" : "Inactive"} */}
                      {updatedMappings[mapping.id]?.status !== undefined
                      ? updatedMappings[mapping.id].status
                        ? "Active"
                        : "Inactive"
                      : mapping.status
                      ? "Active"
                      : "Inactive"
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>アカウント情報が取得できません。</p>
        )}
        <button onClick={applyChanges} disabled={isSubmitting}>
          {isSubmitting ? "Applying Changes..." : "Apply Changes"}
        </button>
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
};

export default MappingTable;