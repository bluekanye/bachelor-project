import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./timetable.css";
import Modal from "./modal";

const Timetable = () => {
  const tableNames = {
    Teachers: "Tanár",
    Classes: "Osztály",
    Subjects: "Tantárgy",
    // Classrooms: "Tanterem",
    TeacherSubjects: "Tanár Tantárgyak",
    ClassesWithSubjects: "Osztályok Tantárgyakkal",
  };

  const tableMapping = {
    Tanár: "Teachers",
    Osztály: "Classes",
    Tantárgy: "Subjects",
    // Tanterem: "Classrooms",
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
  const [classes, setClasses] = useState([]);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        // `http://localhost:3001/api/${tableMapping[selectedTable].toLowerCase()}` localhost mukodeshez
        `${process.env.REACT_APP_API_URL}/api/${tableMapping[selectedTable].toLowerCase()}`
      );
      console.log("API Response:", response.data); 
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
    const fetchInitialData = async () => {
      try {
        const teachersResponse = await axios.get(
          // "http://localhost:3001/api/teachers"   localhost mukodeshez
          `${process.env.REACT_APP_API_URL}/api/teachers`
        );
        setTeachers(teachersResponse.data);

        const subjectsResponse = await axios.get(
          // "http://localhost:3001/api/subjects"  localhost mukodeshez
          `${process.env.REACT_APP_API_URL}/api/subjects`
        );
        setSubjects(subjectsResponse.data);

        const classesResponse = await axios.get(
          // "http://localhost:3001/api/classes"  localhost mukodeshez
          `${process.env.REACT_APP_API_URL}/api/classes`
        );
        setClasses(classesResponse.data);

        const teacherSubjectsResponse = await axios.get(
          // "http://localhost:3001/api/teachersubjects"  localhost mukodeshez   ${process.env.REACT_APP_API_URL}
          `${process.env.REACT_APP_API_URL}/api/teachersubjects`
        );
        setTeacherSubjects(teacherSubjectsResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleShowModal = () => {
    setIsEditing(false);
    setNewData({});
    setSelectedSubjects([]);
    setFilteredTeachers([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewData({});
    setSelectedSubjects([]);
    setFilteredTeachers([]);
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleNewDataChange = (event) => {
    const { name, value } = event.target;
    setNewData({ ...newData, [name]: value });

    if (name === "subjectname") {
      
      const filtered = teacherSubjects
        .filter((ts) => ts.subjectname === value)
        .map((ts) => ({
          teacherid: ts.teacherid,
          teachername: ts.teachername,
        }));
      setFilteredTeachers(filtered);
    }
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
      console.log("Validation failed.");
      return;
    }

    const tableName = tableMapping[selectedTable].toLowerCase();
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/${tableName}${
      isEditing ? `/${editingItemId}` : ""
    }`;
    const method = isEditing ? "put" : "post";

    let payload;
    if (selectedTable === "Osztályok Tantárgyakkal") {
      const selectedClass = classes.find(
        (c) => c.classname === newData.classname
      );
      const selectedSubject = subjects.find(
        (s) => s.subjectname === newData.subjectname
      );
      const selectedTeacherId = parseInt(newData.teacher_id, 10);

      payload = {
        classid: selectedClass ? selectedClass.classid : null,
        subjectid: selectedSubject ? selectedSubject.subjectid : null,
        teacher_id: selectedTeacherId,
        weekly_frequency: parseInt(newData.weekly_frequency, 10),
      };
    } else if (selectedTable === "Tanár Tantárgyak") {
      payload = {
        teachername: newData.teachername,
        subjects: selectedSubjects,
      };
    } else {
      payload = { ...newData };
    }

    console.log("Sending data to API:", payload);

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
        `Error ${isEditing ? "editing" : "adding"} item:`,
        error.response ? error.response.data : error
      );
    }
  };

  const handleDelete = async (item) => {
    const idFieldMap = {
      Teachers: "teacherid",
      Classes: "classid",
      Subjects: "subjectid",
      // Classrooms: "classroomid",
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
        `${process.env.REACT_APP_API_URL}/api/${tableMapping[
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
      // Classrooms: "classroomid",
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
      ...item, 
    });
    setSelectedSubjects(
      item.subjectname
        ? item.subjectname.split(",").map((subject) => subject.trim())
        : []
    );
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
                        <option
                          key={subject.subjectid}
                          value={subject.subjectname}
                        >
                          {subject.subjectname}
                        </option>
                      ))}
                    </select>
                    {errors.subjects && <p>{errors.subjects}</p>}
                    <div>
                      {selectedSubjects.map((subject, index) => (
                        <div key={index}>
                          {subject}{" "}
                          <button
                            type="button"
                            onClick={() => handleSubjectRemove(subject)}
                          >
                            Törlés
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {selectedTable === "Osztályok Tantárgyakkal" && (
                <>
                  <div>
                    <label>Osztály neve</label>
                    <select
                      name="classname"
                      value={newData.classname || ""}
                      onChange={handleNewDataChange}
                      className={errors.classname ? "error" : ""}
                    >
                      <option value="">Válasszon osztályt</option>
                      {classes.map((cls) => (
                        <option key={cls.classid} value={cls.classname}>
                          {cls.classname}
                        </option>
                      ))}
                    </select>
                    {errors.classname && <p>{errors.classname}</p>}
                  </div>
                  <div>
                    <label>Tantárgy neve</label>
                    <select
                      name="subjectname"
                      value={newData.subjectname || ""}
                      onChange={handleNewDataChange}
                      className={errors.subjectname ? "error" : ""}
                    >
                      <option value="">Válasszon tantárgyat</option>
                      {subjects.map((subject) => (
                        <option
                          key={subject.subjectid}
                          value={subject.subjectname}
                        >
                          {subject.subjectname}
                        </option>
                      ))}
                    </select>
                    {errors.subjectname && <p>{errors.subjectname}</p>}
                  </div>
                  <div>
                    <label>Tanár</label>
                    <select
                      name="teacher_id"
                      value={newData.teacher_id || ""}
                      onChange={handleNewDataChange}
                    >
                      <option value="">Válasszon tanárt</option>
                      {filteredTeachers.map((teacher) => (
                        <option
                          key={teacher.teacherid}
                          value={teacher.teacherid}
                        >
                          {teacher.teachername}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Heti óraszám</label>
                    <input
                      type="number"
                      name="weekly_frequency"
                      value={newData.weekly_frequency || ""}
                      onChange={handleNewDataChange}
                      className={errors.weekly_frequency ? "error" : ""}
                    />
                    {errors.weekly_frequency && (
                      <p>{errors.weekly_frequency}</p>
                    )}
                  </div>
                </>
              )}

              {selectedTable !== "Tanár Tantárgyak" &&
                selectedTable !== "Osztályok Tantárgyakkal" &&
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
                {isEditing ? "Szerkesztem" : "Hozzáadás"}
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
                  <th>Tanár + tantárgy azonosítója</th>
                  <th>Tanár neve</th>
                  <th>Tantárgy</th>
                </>
              ) : selectedTable === "Osztályok Tantárgyakkal" ? (
                <>
                  <th>ID</th>
                  <th>Osztály</th>
                  <th>Tantárgy</th>
                  <th>Tanár</th>
                  <th>Heti óraszám</th>
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
                    <td>{item.teacher_name || "Nincs megadva"}</td>
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
                    {Object.entries(item).map(([key, value], idx) => (
                      <td key={`${item.id}-${idx}`}>
                        {key === "teacher_name"
                          ? value || "Nincs megadva"
                          : value !== null
                          ? value.toString()
                          : ""}
                      </td>
                    ))}
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
