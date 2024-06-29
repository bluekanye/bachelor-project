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
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/${tableMapping[selectedTable].toLowerCase()}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (selectedTable) {
      fetchData();
    }
  }, [fetchData, selectedTable]);

  useEffect(() => {
    const fetchTeachersAndSubjects = async () => {
      try {
        const teachersResponse = await axios.get(
          "http://localhost:3001/api/teachers"
        );
        setTeachers(teachersResponse.data);

        const subjectsResponse = await axios.get(
          "http://localhost:3001/api/subjects"
        );
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error fetching teachers or subjects:", error);
      }
    };

    fetchTeachersAndSubjects();
  }, []);

  const handleShowModal = () => {
    setIsEditing(false);
    setNewData({});
    setSelectedSubjects([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewData({});
    setSelectedSubjects([]);
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleNewDataChange = (event) => {
    const { name, value } = event.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleSubjectChange = (event) => {
    const value = event.target.value;
    if (value && !selectedSubjects.includes(value)) {
      setSelectedSubjects([...selectedSubjects, value]);
    }
  };

  const handleSubjectRemove = (subject) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
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

    if (selectedTable === "Tanár Tantárgyak" && selectedSubjects.length === 0) {
      formIsValid = false;
      tempErrors.subjects = "Legalább egy tantárgy kötelező";
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

    let apiUrl = `http://localhost:3001/api/${tableMapping[selectedTable].toLowerCase()}${isEditing ? `/${editingItemId}` : ""}`;
    const method = isEditing ? "put" : "post";

    let payload = newData;
    if (selectedTable === "Tanár Tantárgyak") {
      payload = {
        teachername: newData.teachername,
        subjects: selectedSubjects,
      };
      apiUrl = `http://localhost:3001/api/teachersubjects${isEditing ? `/${editingItemId}` : ""}`;
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
      setSelectedSubjects([]);
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
    console.log(`item: ${JSON.stringify(item)}`);
    console.log(`selectedTable: ${selectedTable}`);
    console.log(`idField: ${idField}`);
    console.log(`id: ${id}`);

    if (typeof id === "undefined") {
      console.error(
        `Az ID mező értéke undefined. Nem lehet törölni a(z) ${selectedTable} elemet.`
      );
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/${tableMapping[selectedTable].toLowerCase()}/${id}`
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

    setIsEditing(true);
    setEditingItemId(item[idField]);
    setNewData({
      ...item, // Load all the current item data into newData state
    });
    setSelectedSubjects(item.subjectname ? item.subjectname.split(",").map(subject => subject.trim()) : []);
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="teachername"
                        value={newData.teachername || ""}
                        onChange={handleNewDataChange}
                        className={errors.teachername ? "error" : ""}
                      />
                    ) : (
                      <select
                        name="teachername"
                        value={newData.teachername || ""}
                        onChange={handleNewDataChange}
                        className={errors.teachername ? "error" : ""}
                      >
                        <option value="">Válasszon tanárt</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.teacherid} value={teacher.name}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.teachername && <p>{errors.teachername}</p>}
                  </div>
                  <div>
                    <label>Tantárgyak hozzáadása</label>
                    <select
                      value=""
                      onChange={handleSubjectChange}
                      className={errors.subjects ? "error" : ""}
                    >
                      <option value="">Válasszon tantárgyat</option>
                      {subjects.map((subject) => (
                        <option key={subject.subjectid} value={subject.subjectname}>
                          {subject.subjectname}
                        </option>
                      ))}
                    </select>
                    {errors.subjects && <p>{errors.subjects}</p>}
                    <div>
                      {selectedSubjects.map((subject, index) => (
                        <div key={index}>
                          {subject} <button type="button" onClick={() => handleSubjectRemove(subject)}>Törlés</button>
                        </div>
                      ))}
                    </div>
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
                {isEditing ? "Szerkesztés" : "Hozzáadás"}
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
              {selectedTable === "Tanár Tantárgyak" ? (
                <>
                  <th>TeacherSubjectID</th>
                  <th>Teacher Name</th>
                  <th>Subject Name</th>
                </>
              ) : (
                data.length > 0 &&
                Object.keys(data[0]).map((key, index) => (
                  <th key={index}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))
              )}
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {selectedTable === "Tanár Tantárgyak"
              ? data.map((item) => (
                  <tr key={item.teachersubjectsid}>
                    <td>{item.teachersubjectsid}</td>
                    <td>{item.teachername}</td>
                    <td>{item.subjectname}</td>
                    <td>
                      <button onClick={() => handleUpdate(item)}>
                        Szerkesztés
                      </button>
                      <button onClick={() => handleDelete(item)}>Törlés</button>
                    </td>
                  </tr>
                ))
              : selectedTable === "Osztályok Tantárgyakkal"
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
                        Szerkesztés
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
