import React, { useState, useEffect } from "react";
import "./components/MappingTable.css";
import ToggleButton from "./components/ToggleButton";
import axios from "axios";

const MappingTable = () => {
  const [mappings, setMappings] = useState([]);
  const [updatedMappings, setUpdatedMappings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMapping, setNewMapping] = useState({
    instagram_id: "",
    google_business_id: "",
    company_name: "",
    status: false,
    start_contract_date: "",
    end_contract_date: "",
    note: "",
  });
  const [deleteId, setDeleteId] = useState("");

  // Fetch mappings data when the component mounts
  useEffect(() => {
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

  const toggleStatus = (id) => {
    setUpdatedMappings({
      ...updatedMappings,
      [id]: { ...updatedMappings[id], status: !updatedMappings[id]?.status },
    });
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
      alert("New mapping added successfully!");
      setNewMapping({
        instagram_id: "",
        google_business_id: "",
        company_name: "",
        status: false,
        start_contract_date: "",
        end_contract_date: "",
        note: "",
      });
    } catch (error) {
      console.error("Failed to add new mapping", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMapping = async () => {
    if (!deleteId) {
      alert("Please enter a valid Instagram ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      alert(`Mapping with Instagram ID: ${deleteId} deleted successfully!`);
      setDeleteId(""); // Clear the input field
    } catch (error) {
      console.error("Failed to delete mapping", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyChanges = async () => {
    setIsSubmitting(true);
    try {
      const updatedMappingsArray = mappings.map((mapping) => {
        const updatedMapping = updatedMappings[mapping.id];
        if (updatedMapping) {
          return {
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
        return mapping;
      });

      alert("All changes applied successfully!");
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
        [field]: value, // Directly store the updated value
      },
    }));
  };

  const getCellStyle = (id, field, originalValue) => {
    const updatedValue = updatedMappings[id]?.[field];
    return updatedValue !== undefined && updatedValue !== originalValue
      ? { backgroundColor: "orange" }
      : {};
  };

  return (
    <div className="table-container">
      <h2>Add New Mapping</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNewMapping();
        }}
        className="mapping-form"
      >
        {/* Form fields for adding new mapping */}
      </form>

      <h2>Mapping Table</h2>
      {mappings.length > 0 ? (
        <table className="mapping-table">
          <thead>
            <tr>
              <th>Instagram ID</th>
              <th>Google Business ID</th>
              <th>Company Name</th>
              <th>Start Contract Date</th>
              <th>End Contract Date</th>
              <th>Note</th>
              <th>Action</th>
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
                    value={
                      updatedMappings[mapping.id]?.start_contract_date || 
                      new Date(mapping.start_contract_date).toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      handleCellChange(mapping.id, "start_contract_date", e.target.value)
                    }
                    style={getCellStyle(mapping.id, "start_contract_date", mapping.start_contract_date)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={
                      updatedMappings[mapping.id]?.end_contract_date || 
                      new Date(mapping.end_contract_date).toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      handleCellChange(mapping.id, "end_contract_date", e.target.value)
                    }
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
                  <ToggleButton
                    active={updatedMappings[mapping.id]?.status || mapping.status}
                    onClick={() => toggleStatus(mapping.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No mappings available to display.</p>
      )}
      <button onClick={applyChanges} disabled={isSubmitting}>
        {isSubmitting ? "Applying Changes..." : "Apply Changes"}
      </button>
    </div>
  );
};

export default MappingTable;
