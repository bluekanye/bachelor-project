require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

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

// Routes
app.post('/api/teachers', async (req, res) => {
  console.log(req.body); 
  const { name, email } = req.body;
  try {
    const newTeacher = await pool.query(
      'INSERT INTO Teachers (Name, Email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(newTeacher.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Read (GET) - Get all teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Teachers');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update (PUT) - Update a teacher's details
app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updateTeacher = await pool.query(
      'UPDATE Teachers SET name = $1, email = $2 WHERE TeacherID = $3 RETURNING *',
      [name, email, id]
    );
    if (updateTeacher.rows.length > 0) {
      res.json(updateTeacher.rows[0]);
    } else {
      res.status(404).send('Teacher not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete (DELETE) - Remove a teacher
app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTeacher = await pool.query(
      'DELETE FROM Teachers WHERE TeacherID = $1 RETURNING *',
      [id]
    );
    if (deleteTeacher.rows.length > 0) {
      res.json({ message: 'Teacher deleted' });
    } else {
      res.status(404).send('Teacher not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/teachers/:id/subjects', async (req, res) => {
  const { id } = req.params;
  try {
    // Updated query to include teacher information
    const { rows } = await pool.query(`
      SELECT s.SubjectID, s.SubjectName, t.TeacherID, t.Name AS TeacherName, t.Email AS TeacherEmail
      FROM Subjects s
      JOIN TeacherSubjects ts ON s.SubjectID = ts.SubjectID
      JOIN Teachers t ON ts.TeacherID = t.TeacherID
      WHERE ts.TeacherID = $1
    `, [id]);
    
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




// Create (POST) - Add a new class
app.post('/api/classes', async (req, res) => {
  const { className } = req.body;
  try {
    const newClass = await pool.query(
      'INSERT INTO Classes (ClassName) VALUES ($1) RETURNING *',
      [className]
    );
    res.json(newClass.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.get('/api/classes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Classes');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.put('/api/classes/:id', async (req, res) => {
  const { id } = req.params; 
  const { className } = req.body;
  try {
    const updateClass = await pool.query(
      'UPDATE Classes SET ClassName = $1 WHERE ClassID = $2 RETURNING *',
      [className, id]
    );
    if (updateClass.rows.length > 0) {
      res.json(updateClass.rows[0]);
    } else {
      res.status(404).send('Class not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.delete('/api/classes/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const deleteClass = await pool.query(
      'DELETE FROM Classes WHERE ClassID = $1 RETURNING *',
      [id]
    );
    if (deleteClass.rows.length > 0) {
      res.json({ message: 'Class deleted' });
    } else {
      res.status(404).send('Class not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.get('/api/subjects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Subjects');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/subjects', async (req, res) => {
  const { subjectName } = req.body;
  try {
    const newSubject = await pool.query(
      'INSERT INTO Subjects (SubjectName) VALUES ($1) RETURNING *',
      [subjectName]
    );
    res.json(newSubject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.put('/api/subjects/:id', async (req, res) => {
  const { id } = req.params; 
  const { subjectName } = req.body;
  try {
    const updateSubject = await pool.query(
      'UPDATE Subjects SET SubjectName = $1 WHERE SubjectID = $2 RETURNING *',
      [subjectName, id]
    );
    if (updateSubject.rows.length > 0) {
      res.json(updateSubject.rows[0]);
    } else {
      res.status(404).send('Subject not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const deleteSubject = await pool.query(
      'DELETE FROM Subjects WHERE SubjectID = $1 RETURNING *',
      [id]
    );
    if (deleteSubject.rows.length > 0) {
      res.json({ message: 'Subject deleted' });
    } else {
      res.status(404).send('Subject not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.get('/api/classrooms', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Classrooms');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/teacher-subjects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM TeacherSubjects');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/teacher-subjects', async (req, res) => {
  const { teacherId, subjectId } = req.body;
  try {
    const results = await Promise.all(
      subjectId.map(id => {
        return pool.query(
          'INSERT INTO TeacherSubjects (TeacherID, SubjectID) VALUES ($1, $2) RETURNING *',
          [teacherId, id]
        );
      })
    );
    const insertedRecords = results.map(result => result.rows[0]);
    res.json(insertedRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



app.delete('/api/teacher-subjects', async (req, res) => {
  const { teacherId, subjectId } = req.body;
  try {
    const { rows } = await pool.query(
      'DELETE FROM TeacherSubjects WHERE TeacherID = $1 AND SubjectID = $2 RETURNING *',
      [teacherId, subjectId]
    );
    if (rows.length > 0) {
      res.json({ message: 'Subject unassigned from teacher' });
    } else {
      res.status(404).send('Assignment not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



app.get('/api/class-schedules', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ClassSchedules');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const defaultRole = 'admin';

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await pool.query(
      'INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, defaultRole]
    );
    res.status(201).json(newUser.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


const jwt = require('jsonwebtoken');



app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM Users WHERE Username = $1', [username]);
    
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].passwordhash);
      
      if (validPassword) {
        const token = jwt.sign({ id: user.rows[0].userid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(400).send('Invalid Password');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

