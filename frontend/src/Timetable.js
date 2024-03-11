import React, { useState } from "react";
import "./timetable.css";

const Timetable = () => {
  const [timetable, setTimetable] = useState({
    "08:00 - 08:45": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
    "08:50 - 09:35": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
    "09:40 - 10:25": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
    "10:40 - 11:25": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
    "11:30 - 12:15": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
    "12:20 - 13:05": {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
    },
  });

  const handleSubjectChange = (period, day, subject) => {
    setTimetable((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [day]: subject,
      },
    }));
  };

  const deleteSubject = (period, day) => {
    setTimetable((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [day]: "",
      },
    }));
  };

  const handleSubjectAddition = (period, day) => {
    const subject = prompt(`Add a subject for ${day} during ${period}`);
    if (subject) {
      handleSubjectChange(period, day, subject);
    }
  };

  return (
    <div className="timetable-container">
      <h1>Create Your Timetable</h1>
      <table className="timetable">
        <thead>
          <tr>
            <th>Time / Period</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(timetable).map((period) => (
            <tr key={period}>
              <td>{period}</td>
              {Object.keys(timetable[period]).map((day) => (
                <td key={day}>
                  <div className="subject-cell">
                    {timetable[period][day] && (
                      <div className="subject-content">
                        {timetable[period][day]}
                        <button
                          className="delete-button"
                          onClick={() => deleteSubject(period, day)}
                          aria-label="Delete subject"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {!timetable[period][day] && (
                      <button
                        onClick={() => handleSubjectAddition(period, day)}
                      >
                        Add Subject
                      </button>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
