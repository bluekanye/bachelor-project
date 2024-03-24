import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (selectedTable) {
      axios
        .get(`http://localhost:3001/api/${selectedTable.toLowerCase()}`)
        .then((response) => setData(response.data))
        .catch((error) => console.error("Failed to fetch data:", error));
    }
  }, [selectedTable]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleAddNewData = async (event) => {
    event.preventDefault();
    console.log(newData);
    if (!validate()) {
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/api/${selectedTable.toLowerCase()}`,
        { ...newData }
      );

      setData([...data, response.data]);
      setNewData({}); // Reset form
      setShowModal(false); // Close modal
    } catch (error) {
      console.error(`Error adding new item to ${selectedTable}:`, error);
    }
  };

  const idFieldMap = {
    Teachers: "teacherid",
    Classes: "classid",
    Subjects: "subjectid",
    Classrooms: "classroomid",

    
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

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/api/${selectedTable.toLowerCase()}/${id}`,
        updatedData
      );
      setData(
        data.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
    } catch (error) {
      console.error(`Error updating item in ${selectedTable}:`, error);
    }
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
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <div key={key}>
                    <label>{key}</label>
                    <input
                      name={key}
                      value={newData[key] || ""}
                      onChange={handleNewDataChange}
                      className={errors[key] ? "error" : ""}
                    />
                    {errors[key] && <p>{errors[key]}</p>}
                  </div>
                ))}
              <button type="submit">Add</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </Modal>
        )}
        <main className="content">
          <table className="data-table">
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
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
                    <button
                      onClick={() =>
                        console.log(item) || handleUpdate(item.id, item)
                      }
                    >
                      Update
                    </button>
                    <button onClick={() => handleDelete(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </main>
    </div>
  );
};

export default Timetable;
