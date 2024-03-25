import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import "./timetable.css";
import Modal from "./modal";

const Timetable = () => {
  const [tables] = useState([
    "Teachers",
    "Classes",
    "Subjects",
    "Classrooms",
    "TeacherSubjects",
    "ClassSchedules",
  ]);
  const [selectedTable, setSelectedTable] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/${selectedTable.toLowerCase()}`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [selectedTable, setData]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const handleShowModal = () => {
    setIsEditing(false); 
    setNewData({}); 
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setNewData({});
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleNewDataChange = (event) => {
    const { name, value } = event.target;
    setNewData({ ...newData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    let formIsValid = true;

    for (let key in newData) {
      if (newData[key] === "") {
        formIsValid = false;
        tempErrors[key] = "This field is required";
      }
    }

    if (
      selectedTable === "Subjects" &&
      (!newData.subjectname || newData.subjectname.trim() === "")
    ) {
      formIsValid = false;
      tempErrors.subjectname = "Subject name is required";
    }
    
if (selectedTable.toLowerCase() === 'teachersubjects' && newData.subjects) {
  const subjectsArray = newData.subjects.split(',').map(subject => subject.trim());
  if (subjectsArray.length === 0 || subjectsArray.some(subject => subject === "")) {
    formIsValid = false;
    tempErrors.subjects = "At least one subject is required";
  }
}


    setErrors(tempErrors);
    return formIsValid;
  };

  const handleAddNewData = async (event) => {
    event.preventDefault();
  
    if (!validate()) {
      console.log("Validation failed.");
      return;
    }
  
    let apiUrl = `http://localhost:3001/api/${selectedTable.toLowerCase()}${isEditing ? `/${editingItemId}` : ''}`;
    const method = isEditing ? 'put' : 'post';
  
    // If the selected table is 'teachersubjects', structure the data accordingly
    let payload = newData;
    if (selectedTable.toLowerCase() === 'teachersubjects') {
      payload = {
        teachername: newData.teachername, 
        subjects: newData.subjects ? newData.subjects.split(',').map(subject => subject.trim()) : [], 
      };
      apiUrl = 'http://localhost:3001/api/teachersubjects'; 
    }
    
    console.log("Sending data to API:", payload);
  
    try {
      const response = await axios({
        method: method,
        url: apiUrl,
        data: payload,
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log(response.data); 
  
      setNewData({});
      setShowModal(false);
      setIsEditing(false);
      setEditingItemId(null);
  
      fetchData();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} item:`, error.response ? error.response.data : error);
    }
  };
  

  const idFieldMap = {
    Teachers: "teacherid",
    Classes: "classid",
    Subjects: "subjectid",
    Classrooms: "classroomid",
    TeacherSubjects: "teachersubjectsid",
    ClassSchedules: "classscheduleid",
  };

  const handleDelete = async (item) => {
    const idField = idFieldMap[selectedTable];
    const id = item[idField];

    if (typeof id === "undefined") {
      console.error(
        `The ID for the selected item is undefined. Cannot delete the ${selectedTable} item.`
      );
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/${selectedTable.toLowerCase()}/${id}`
      );

      if (response.status === 200) {
        setData(data.filter((item) => item[idField] !== id));
      }
    } catch (error) {
      console.error(
        `Error deleting ${selectedTable} item with ID ${id}:`,
        error
      );
    }
  };

  const handleUpdate = (item) => {
    const idField = idFieldMap[selectedTable]; 
    setNewData(item); 
    setEditingItemId(item[idField]); 
    setIsEditing(true);
    setShowModal(true);
  };
  

  return (
    <div className="timetable-app">
      <aside className="sidebar">
        <h2>Tables</h2>
        <ul>
          {tables.map((table, index) => (
            <li key={index} onClick={() => setSelectedTable(table)}>
              {table}
            </li>
          ))}
        </ul>
      </aside>
      <main className="content">
        <h2>{selectedTable}</h2>
        <button onClick={handleShowModal}>Add Item</button>
        {showModal && (
          <Modal onClose={handleCloseModal}>
            <form onSubmit={handleAddNewData}>
              {selectedTable === "TeacherSubjects" && (
                <>
                  <div>
                    <label>Teacher Name</label>
                    <input
                      name="teachername"
                      value={newData.teachername || ""}
                      onChange={handleNewDataChange}
                      className={errors.teachername ? "error" : ""}
                    />
                    {errors.teachername && <p>{errors.teachername}</p>}
                  </div>
                  <div>
                    <label>Subjects (comma-separated)</label>
                    <input
                      name="subjects"
                      value={newData.subjects || ""}
                      onChange={handleNewDataChange}
                      className={errors.subjects ? "error" : ""}
                      placeholder="Subject1, Subject2, Subject3"
                    />
                    {errors.subjects && <p>{errors.subjects}</p>}
                  </div>
                </>
              )}
              {selectedTable !== "TeacherSubjects" && data.length > 0 &&
                Object.keys(data[0]).map((key, index) => (
                  <div key={index}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={newData[key] || ""}
                      onChange={handleNewDataChange}
                      className={errors[key] ? "error" : ""}
                    />
                    {errors[key] && <p>{errors[key]}</p>}
                  </div>
                ))}
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </Modal>
        )}
        <table className="data-table">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key, index) => <th key={index}>{key}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>{value !== null ? value.toString() : ""}</td>
                ))}
                <td>
                  <button onClick={() => handleUpdate(item)}>Update</button>
                  <button onClick={() => handleDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
                };

export default Timetable;

