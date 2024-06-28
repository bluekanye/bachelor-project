import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./timetable.css";
import Modal from "./modal";

const Timetable = () => {
  const tableNames = {
    Teachers: "Tanár",
    Classes: "Osztály",
    Subjects: "Tantárgy",
    Classrooms: "Tanterem",
    TeacherSubjects: "Tanár Tantárgyak",
    ClassesWithSubjects: "Osztályok Tantárgyakkal",
  };

  const tableMapping = {
    Tanár: "Teachers",
    Osztály: "Classes",
    Tantárgy: "Subjects",
    Tanterem: "Classrooms",
    "Tanár Tantárgyak": "TeacherSubjects",
    "Osztályok Tantárgyakkal": "ClassesWithSubjects",
  };

  const [tables] = useState(Object.values(tableNames));
  const [selectedTable, setSelectedTable] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newData, setNewData] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/${tableMapping[selectedTable].toLowerCase()}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [selectedTable, setData]);

  useEffect(() => {
    if (selectedTable) {
      fetchData();
    }
  }, [fetchData, selectedTable]);

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
        tempErrors[key] = "Ez a mező kötelező";
      }
    }

    if (
      selectedTable === "Tantárgy" &&
      (!newData.subjectname || newData.subjectname.trim() === "")
    ) {
      formIsValid = false;
      tempErrors.subjectname = "A tantárgy neve kötelező";
    }

    if (selectedTable === "Tanár Tantárgyak" && newData.subjects) {
      const subjectsArray = newData.subjects
        .split(",")
        .map((subject) => subject.trim());
      if (
        subjectsArray.length === 0 ||
        subjectsArray.some((subject) => subject === "")
      ) {
        formIsValid = false;
        tempErrors.subjects = "Legalább egy tantárgy kötelező";
      }
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleAddNewData = async (event) => {
    event.preventDefault();

    if (!validate()) {
      console.log("Érvényesítés sikertelen.");
      return;
    }

    let apiUrl = `http://localhost:3001/api/${tableMapping[
      selectedTable
    ].toLowerCase()}${isEditing ? `/${editingItemId}` : ""}`;
    const method = isEditing ? "put" : "post";

    let payload = newData;
    if (selectedTable === "Tanár Tantárgyak") {
      payload = {
        teachername: newData.teachername,
        subjects: newData.subjects
          ? newData.subjects.split(",").map((subject) => subject.trim())
          : [],
      };
      apiUrl = "http://localhost:3001/api/teachersubjects";
    }

    console.log("Adatok küldése az API-hoz:", payload);

    try {
      const response = await axios({
        method: method,
        url: apiUrl,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.data);

      setNewData({});
      setShowModal(false);
      setIsEditing(false);
      setEditingItemId(null);

      fetchData();
    } catch (error) {
      console.error(
        `Hiba az elem ${isEditing ? "frissítése" : "hozzáadása"} közben:`,
        error.response ? error.response.data : error
      );
    }
  };

  const handleDelete = async (item) => {
    const idFieldMap = {
      Teachers: "teacherid",
      Classes: "classid",
      Subjects: "subjectid",
      Classrooms: "classroomid",
      TeacherSubjects: "teachersubjectsid",
      ClassesWithSubjects: "id",
    };
    const idField = idFieldMap[tableMapping[selectedTable]];
    const id = item[idField];

    if (typeof id === "undefined") {
      console.error(
        `Az ID mező értéke undefined. Nem lehet törölni a(z) ${selectedTable} elemet.`
      );
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/${tableMapping[
          selectedTable
        ].toLowerCase()}/${id}`
      );

      if (response.status === 200) {
        setData(data.filter((item) => item[idField] !== id));
      }
    } catch (error) {
      console.error(
        `Hiba a(z) ${tableMapping[selectedTable]} elem ID-val történő törlése közben ${id}:`,
        error
      );
    }
  };

  const handleUpdate = (item) => {
    const idFieldMap = {
      Teachers: "teacherid",
      Classes: "classid",
      Subjects: "subjectid",
      Classrooms: "classroomid",
      TeacherSubjects: "teachersubjectsid",
      ClassesWithSubjects: "id",
    };
    const idField = idFieldMap[tableMapping[selectedTable]];
    if (item[idField] === undefined) {
      console.error("Az ID mező értéke undefined, nem lehet szerkeszteni.");
      return;
    }
    setNewData(item);
    setEditingItemId(item[idField]);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="timetable-app">
      <aside className="sidebar">
        <h2>Táblák</h2>
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
        <button onClick={handleShowModal}>Új elem hozzáadása</button>
        {showModal && (
          <Modal onClose={handleCloseModal}>
            <form onSubmit={handleAddNewData}>
              {selectedTable === "Tanár Tantárgyak" && (
                <>
                  <div>
                    <label>Tanár neve</label>
                    <input
                      name="teachername"
                      value={newData.teachername || ""}
                      onChange={handleNewDataChange}
                      className={errors.teachername ? "error" : ""}
                    />
                    {errors.teachername && <p>{errors.teachername}</p>}
                  </div>
                  <div>
                    <label>Tantárgyak (vesszővel elválasztva)</label>
                    <input
                      name="subjects"
                      value={newData.subjects || ""}
                      onChange={handleNewDataChange}
                      className={errors.subjects ? "error" : ""}
                      placeholder="Tantárgy1, Tantárgy2, Tantárgy3"
                    />
                    {errors.subjects && <p>{errors.subjects}</p>}
                  </div>
                </>
              )}
              {selectedTable !== "Tanár Tantárgyak" &&
                data.length > 0 &&
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
              <button type="submit">
                {isEditing ? "Frissítés" : "Hozzáadás"}
              </button>
              <button type="button" onClick={handleCloseModal}>
                Mégse
              </button>
            </form>
          </Modal>
        )}
        <table className="data-table">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key, index) => (
                  <th key={index}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {selectedTable === "Osztályok Tantárgyakkal"
              ? data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.classname}</td>
                    <td>{item.subjectname}</td>
                    <td>{item.weekly_frequency} x / hét</td>
                    <td>
                      <button onClick={() => handleUpdate(item)}>
                        Szerkesztés
                      </button>
                      <button onClick={() => handleDelete(item)}>Törlés</button>
                    </td>
                  </tr>
                ))
              : Array.isArray(data) &&
                data.map((item) => (
                  <tr key={item.id}>
                    {Object.entries(item).map(([key, value], idx) => {
                      if (key !== "subjects") {
                        return (
                          <td key={`${item.id}-${idx}`}>
                            {value !== null ? value.toString() : ""}
                          </td>
                        );
                      }
                      return null;
                    })}
                    <td>
                      <button onClick={() => handleUpdate(item)}>
                        Frissítés
                      </button>
                      <button onClick={() => handleDelete(item)}>Törlés</button>
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
