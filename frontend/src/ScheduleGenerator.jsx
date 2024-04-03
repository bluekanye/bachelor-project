import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./generator.css";

const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
const timeSlots = [
  "8:00-8:45",
  "8:50-9:35",
  "9:40-10:25",
  "10:30-11:15",
  "11:20-12:05",
  "12:10-12:55",
  "13:00-13:45",
  "13:50-14:35",
];

const ScheduleGenerator = () => {
  const [schedule, setSchedule] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [availableSchedules, setAvailableSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Órarend lekérése
        const response = await axios.get("http://localhost:3001/api/timetable");
        setSchedule(response.data);
      } catch (error) {
        console.error("Hiba történt az órarend lekérésekor:", error);
      }
    };
  
    const fetchAvailableSchedules = async () => {
      try {
        // Osztályok lekérése az adatbázisból
        const classesResponse = await axios.get("http://localhost:3001/api/classes");
        const classNames = classesResponse.data.map(classObj => classObj.classname);
        setAvailableSchedules(classNames);
      } catch (error) {
        console.error("Hiba történt az elérhető órarendek lekérésekor:", error);
      }
    };

    // Órarend és osztályok lekérése az oldal betöltésekor
    fetchSchedule();
    fetchAvailableSchedules();
  }, []);

  const generateSchedule = async () => {
    try {
      // Tantárgyak lekérése az adatbázisból
      const subjectsResponse = await axios.get("http://localhost:3001/api/subjects");
      const subjects = subjectsResponse.data;

      // Órarend generálása az adatok alapján...
      // Ide írd a generálási logikát a lekért tantárgyak és osztályok alapján
      // Például: const generatedSchedule = generateScheduleLogic(subjects, availableSchedules);
    } catch (error) {
      console.error("Hiba történt az órarend generálása során:", error);
    }
  };

  const getScheduleForTimeSlot = (day, time) => {
    return schedule.find((s) => s.dayofweek === day && s.starttime === time);
  };

  const downloadPdf = async () => {
    const input = document.getElementById('timetable');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('schedule.pdf');
  };

  return (
    <div className="schedule-generator-container">
      <h2 className="schedule-generator-title">Órarend</h2>

      <div className="schedule-selection">
        <select value={selectedScheduleId} onChange={(e) => setSelectedScheduleId(e.target.value)}>
          {availableSchedules.map((className, index) => (
            <option key={index} value={className}>{className}</option>
          ))}
        </select>
        <button onClick={generateSchedule}>Órarend Generálás</button>
      </div>

      <div className="timetable-container">
        <table className="timetable" id="timetable">
          <thead>
            <tr>
              <th>Idő</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot}>
                <td>{timeSlot}</td>
                {days.map((day) => (
                  <td key={day}>
                    {getScheduleForTimeSlot(day, timeSlot) || "---"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={downloadPdf}>Letöltés PDF-ben</button>

    </div>
  );
};

export default ScheduleGenerator;
