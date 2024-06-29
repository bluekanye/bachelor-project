require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

const allowedTables = [
  "Teachers",
  "Classes",
  "Subjects",
  "Classrooms",
  "TeacherSubjects",
  "ClassesWithSubjects",
];

app.get("/api/tables", (req, res) => {
  res.json(allowedTables);
});

// Routes POST
app.post("/api/teachers", async (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  try {
    const newTeacher = await pool.query(
      "INSERT INTO Teachers (Name, Email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(newTeacher.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Read (GET) - Get all teachers
app.get("/api/teachers", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Teachers");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update (PUT) - Update a teacher's details
app.put("/api/teachers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updateTeacher = await pool.query(
      "UPDATE Teachers SET name = $1, email = $2 WHERE TeacherID = $3 RETURNING *",
      [name, email, id]
    );
    if (updateTeacher.rows.length > 0) {
      res.json(updateTeacher.rows[0]);
    } else {
      res.status(404).send("Teacher not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete (DELETE) - Remove a teacher
app.delete("/api/teachers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTeacher = await pool.query(
      "DELETE FROM Teachers WHERE TeacherID = $1 RETURNING *",
      [id]
    );
    if (deleteTeacher.rows.length > 0) {
      res.json({ message: "Teacher deleted" });
    } else {
      res.status(404).send("Teacher not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// app.get('/api/teachers/:id/subjects', async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Updated query to include teacher information
//     const { rows } = await pool.query(`
//       SELECT s.SubjectID, s.SubjectName, t.TeacherID, t.Name AS TeacherName, t.Email AS TeacherEmail
//       FROM Subjects s
//       JOIN TeacherSubjects ts ON s.SubjectID = ts.SubjectID
//       JOIN Teachers t ON ts.TeacherID = t.TeacherID
//       WHERE ts.TeacherID = $1
//     `, [id]);

//     res.json(rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// Create (POST) - Add a new class
app.post("/api/classes", async (req, res) => {
  const { classname } = req.body;
  try {
    const newClass = await pool.query(
      "INSERT INTO Classes (ClassName) VALUES ($1) RETURNING *",
      [classname]
    );
    res.json(newClass.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/classes", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Classes");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/api/classes/:id", async (req, res) => {
  const { id } = req.params;
  const { classname } = req.body;
  try {
    const updateClass = await pool.query(
      "UPDATE Classes SET ClassName = $1 WHERE ClassID = $2 RETURNING *",
      [classname, id]
    );
    if (updateClass.rows.length > 0) {
      res.json(updateClass.rows[0]);
    } else {
      res.status(404).send("Class not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/classes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteClass = await pool.query(
      "DELETE FROM Classes WHERE ClassID = $1 RETURNING *",
      [id]
    );
    if (deleteClass.rows.length > 0) {
      res.json({ message: "Class deleted" });
    } else {
      res.status(404).send("Class not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/subjects", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Subjects");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//POST tantárgyak
app.post("/api/subjects", async (req, res) => {
  const { subjectname } = req.body;
  try {
    const newSubject = await pool.query(
      "INSERT INTO Subjects (SubjectName) VALUES ($1) RETURNING *",
      [subjectname]
    );
    res.json(newSubject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/api/subjects/:id", async (req, res) => {
  const { id } = req.params;
  const { subjectname } = req.body;
  try {
    const updateSubject = await pool.query(
      "UPDATE Subjects SET SubjectName = $1 WHERE SubjectID = $2 RETURNING *",
      [subjectname, id]
    );
    if (updateSubject.rows.length > 0) {
      res.json(updateSubject.rows[0]);
    } else {
      res.status(404).send("Subject not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSubject = await pool.query(
      "DELETE FROM Subjects WHERE SubjectID = $1 RETURNING *",
      [id]
    );
    if (deleteSubject.rows.length > 0) {
      res.json({ message: "Subject deleted" });
    } else {
      res.status(404).send("Subject not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// CREATE
app.post("/api/classrooms", async (req, res) => {
  const { classroomname, capacity } = req.body;
  try {
    const newClassroom = await pool.query(
      "INSERT INTO Classrooms (ClassRoomName, Capacity) VALUES ($1, $2) RETURNING *",
      [classroomname, capacity]
    );
    res.json(newClassroom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// READ (already provided)
app.get("/api/classrooms", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM Classrooms");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// UPDATE
app.put("/api/classrooms/:id", async (req, res) => {
  const { id } = req.params;
  const { classroomname, capacity } = req.body;
  try {
    const updateClassroom = await pool.query(
      "UPDATE Classrooms SET ClassRoomName = $1, Capacity = $2 WHERE Classroomid = $3 RETURNING *",
      [classroomname, capacity, id]
    );
    if (updateClassroom.rows.length === 0) {
      return res.status(404).send("Classroom not found");
    }
    res.json(updateClassroom.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// DELETE
app.delete("/api/classrooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteClassroom = await pool.query(
      "DELETE FROM Classrooms WHERE classroomid = $1 RETURNING *",
      [id]
    );
    if (deleteClassroom.rows.length === 0) {
      return res.status(404).send("Classroom not found");
    }
    res.json({ message: "Classroom deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// app.get("/api/teachersubjects", async (req, res) => {
//   try {
//     // Query to fetch all teacher-subject associations
//     const { rows } = await pool.query(`
//       SELECT 
//         ts.teachersubjectsid,
//         s.SubjectID, 
//         s.SubjectName, 
//         t.TeacherID, 
//         t.Name AS TeacherName
//       FROM 
//         Subjects s
//       JOIN 
//         TeacherSubjects ts ON s.SubjectID = ts.SubjectID
//       JOIN 
//         Teachers t ON ts.TeacherID = t.TeacherID
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });


// app.post("/api/teachersubjects", async (req, res) => {
//   const { teachername, subjects } = req.body;
//   if (!teachername || !subjects || !Array.isArray(subjects)) {
//     return res.status(400).send("Invalid request body");
//   }

//   try {
//     // Get the TeacherID for the provided teacher name
//     const teacherResult = await pool.query(
//       "SELECT TeacherID FROM Teachers WHERE name = $1",
//       [teachername]
//     );
//     const teacherId = teacherResult.rows[0]?.teacherid;
//     if (!teacherId) {
//       return res.status(400).send("Teacher not found");
//     }

//     // Get the SubjectIDs for the provided subject names
//     const subjectIds = await Promise.all(
//       subjects.map(async (subjectname) => {
//         const subjectResult = await pool.query(
//           "SELECT SubjectID FROM Subjects WHERE SubjectName = $1",
//           [subjectname]
//         );
//         const subjectId = subjectResult.rows[0]?.subjectid;
//         if (!subjectId) {
//           throw new Error(`Subject not found: ${subjectname}`);
//         }
//         return subjectId;
//       })
//     );

//     // Insert the teacher-subject associations
//     const results = await Promise.all(
//       subjectIds.map((subjectid) => {
//         return pool.query(
//           "INSERT INTO TeacherSubjects (TeacherID, SubjectID) VALUES ($1, $2) RETURNING *",
//           [teacherId, subjectid]
//         );
//       })
//     );

//     const insertedRecords = results.map((result) => result.rows[0]);
//     res.json(insertedRecords);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });


// app.delete("/api/teachersubjects/:id", async (req, res) => {
//   const { teachersubjectsid } = req.params;
//   console.log(
//     `Received request to delete teacher-subject association: teachersubjectsid=${id}`
//   );

//   // Check if id is provided and valid
//   if (!id) {
//     return res.status(400).send("teachersubjectsid must be provided");
//   }

//   try {
//     const { rows } = await pool.query(
//       "DELETE FROM TeacherSubjects WHERE teachersubjectsid = $1 RETURNING *",
//       [teachersubjectsid]
//     );

//     // Check if any record was deleted
//     if (rows.length > 0) {
//       console.log(`Deleted ${rows.length} record(s)`);
//       res.json({ message: "Subject unassigned from teacher" });
//     } else {
//       // If no record was deleted, return a 404 status
//       res.status(404).send("Assignment not found");
//     }
//   } catch (err) {
//     console.error("Error deleting teacher-subject association:", err.message);
//     res.status(500).send("Server error");
//   }
// });
app.get("/api/teachersubjects", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        ts.teachersubjectsid,
        ts.teacherid,
        ts.subjectid,
        t.name AS teachername,
        s.subjectname
      FROM 
        teachersubjects ts
      JOIN 
        teachers t ON ts.teacherid = t.teacherid
      JOIN 
        subjects s ON ts.subjectid = s.subjectid
    `);
    console.log(rows); // Log the result
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




app.post("/api/teachersubjects", async (req, res) => {
  const { teachername, subjects } = req.body;
  if (!teachername || !subjects || !Array.isArray(subjects)) {
    return res.status(400).send("Invalid request body");
  }

  try {
    // Get the TeacherID for the provided teacher name
    const teacherResult = await pool.query(
      "SELECT teacherid FROM teachers WHERE name = $1",
      [teachername]
    );
    const teacherId = teacherResult.rows[0]?.teacherid;
    if (!teacherId) {
      return res.status(400).send("Teacher not found");
    }

    // Get the SubjectIDs for the provided subject names
    const subjectIds = await Promise.all(
      subjects.map(async (subjectname) => {
        const subjectResult = await pool.query(
          "SELECT subjectid FROM subjects WHERE subjectname = $1",
          [subjectname]
        );
        const subjectId = subjectResult.rows[0]?.subjectid;
        if (!subjectId) {
          throw new Error(`Subject not found: ${subjectname}`);
        }
        return subjectId;
      })
    );

    // Insert the teacher-subject associations
    const results = await Promise.all(
      subjectIds.map((subjectid) => {
        return pool.query(
          "INSERT INTO teachersubjects (teacherid, subjectid) VALUES ($1, $2) RETURNING *",
          [teacherId, subjectid]
        );
      })
    );

    const insertedRecords = results.map((result) => result.rows[0]);
    res.json(insertedRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/teachersubjects/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete teacher-subject association: teachersubjectsid=${id}`);

  try {
    const { rows } = await pool.query(
      "DELETE FROM teachersubjects WHERE teachersubjectsid = $1 RETURNING *",
      [id]
    );

    // Check if any record was deleted
    if (rows.length > 0) {
      console.log(`Deleted ${rows.length} record(s)`);
      res.json({ message: "Subject unassigned from teacher" });
    } else {
      // If no record was deleted, return a 404 status
      res.status(404).send("Assignment not found");
    }
  } catch (err) {
    console.error("Error deleting teacher-subject association:", err.message);
    res.status(500).send("Server error");
  }
});

app.put("/api/teachersubjects/:id", async (req, res) => {
  const { id } = req.params; // A tanár-tárgy kapcsolat azonosítója
  const { teachername, subjects } = req.body; // Feltételezve, hogy a tanár nevét és a tárgyak listáját küldjük

  if (!teachername || !subjects || !Array.isArray(subjects)) {
    return res.status(400).send("Invalid request body");
  }

  try {
    // Get the TeacherID for the provided teacher name
    const teacherResult = await pool.query(
      "SELECT teacherid FROM teachers WHERE name = $1",
      [teachername]
    );
    const teacherId = teacherResult.rows[0]?.teacherid;
    if (!teacherId) {
      return res.status(400).send("Teacher not found");
    }

    // Get the SubjectIDs for the provided subject names
    const subjectIds = await Promise.all(
      subjects.map(async (subjectname) => {
        const subjectResult = await pool.query(
          "SELECT subjectid FROM subjects WHERE subjectname = $1",
          [subjectname]
        );
        const subjectId = subjectResult.rows[0]?.subjectid;
        if (!subjectId) {
          throw new Error(`Subject not found: ${subjectname}`);
        }
        return subjectId;
      })
    );

    // Update the teacher-subject association
    await pool.query(
      "DELETE FROM teachersubjects WHERE teachersubjectsid = $1",
      [id]
    );

    const results = await Promise.all(
      subjectIds.map((subjectid) => {
        return pool.query(
          "INSERT INTO teachersubjects (teacherid, subjectid) VALUES ($1, $2) RETURNING *",
          [teacherId, subjectid]
        );
      })
    );

    const updatedRecords = results.map((result) => result.rows[0]);
    res.json(updatedRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.get("/api/class-schedules", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ClassSchedules");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const bcrypt = require("bcrypt");

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const defaultRole = "admin";

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await pool.query(
      "INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, defaultRole]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const jwt = require("jsonwebtoken");

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM Users WHERE Username = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].passwordhash
      );

      if (validPassword) {
        const token = jwt.sign(
          { id: user.rows[0].userid },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(400).send("Invalid Password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/classeswithsubjects", async (req, res) => {
  try {
    const query = `
      SELECT 
        cs.id, 
        cl.classname, 
        su.subjectname, 
        cs.weekly_frequency
      FROM 
        class_subjects cs
        JOIN classes cl ON cs.classid = cl.classid
        JOIN subjects su ON cs.subjectid = su.subjectid
      ORDER BY
        cl.classname,
        su.subjectname;
    `;
    const { rows } = await pool.query(query);
    res.json(rows); // Send back the rows as an array
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create (POST) - Add a new subject frequency associated with a class
app.post("/api/classeswithsubjects", async (req, res) => {
  const { classid, subjectid, weekly_frequency } = req.body;
  try {
    const newFrequency = await pool.query(
      "INSERT INTO class_subjects (classid, subjectid, weekly_frequency) VALUES ($1, $2, $3) RETURNING *",
      [classid, subjectid, weekly_frequency]
    );
    res.status(201).json(newFrequency.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/api/classeswithsubjects/:id", async (req, res) => {
  const { id } = req.params;
  const { weekly_frequency } = req.body;

  // Validate id and weekly_frequency
  const validId = parseInt(id);
  const validWeeklyFrequency = parseInt(weekly_frequency);

  console.log("ID:", id, "Weekly Frequency:", weekly_frequency);

  if (isNaN(validId) || isNaN(validWeeklyFrequency)) {
    return res.status(400).send("Invalid input syntax for type integer");
  }

  try {
    const updateFrequency = await pool.query(
      "UPDATE class_subjects SET weekly_frequency = $1 WHERE id = $2 RETURNING *",
      [validWeeklyFrequency, validId]
    );

    if (updateFrequency.rows.length > 0) {
      res.json(updateFrequency.rows[0]);
    } else {
      res.status(404).send("Subject frequency not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
