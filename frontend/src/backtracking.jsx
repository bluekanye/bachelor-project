import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import "./backtrack.css";
import { DAYS_OF_WEEK, TIME_SLOTS } from "./data.js"; // Ensure this file contains these constants

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "20px",
  marginTop: "50px",
};

const individualScheduleStyle = {
  backgroundColor: "#f7f7f7",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "15px",
  boxSizing: "border-box",
  width: "calc(20% - 20px)",
  marginBottom: "20px",
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

class Class {
  constructor(name, subjects) {
    this.name = name;
    this.subjects = subjects;
  }
}

function Backtrack() {
  const [schedules, setSchedules] = useState([]);
  const [finalConflicts, setFinalConflicts] = useState({});
  const [classSchedules, setClassSchedules] = useState([]);

  const fetchData = async () => {
    try {
      // const classSubjectResponse = await axios.get("http://localhost:3001/api/classeswithsubjects"); // localhosthoz
      const classSubjectResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/classeswithsubjects`);
  
      const classSubjectData = classSubjectResponse.data;
      console.log("Class Subject Data:", classSubjectData); // Debugging line
  
      // Process the data
      const classMap = {};
  
      classSubjectData.forEach(item => {
        if (!classMap[item.classname]) {
          classMap[item.classname] = [];
        }
        classMap[item.classname].push({
          subjectName: item.subjectname,
          teacherName: item.teacher_name,  // Ensure correct field name here
          quantity: item.weekly_frequency,
        });
      });
  
      const generatedClassSchedules = Object.keys(classMap).map(className => {
        return new Class(className, classMap[className]);
      });
  
      console.log("Generated Class Schedules:", generatedClassSchedules); // Debugging line
  
      setClassSchedules(generatedClassSchedules);
  
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

  const generateSchedulesForAllClasses = useCallback(async () => {
    const generatedSchedules = {};

    for (const classObj of classSchedules) {
      console.log("Generating schedule for class", classObj.name);
      const schedule = DAYS_OF_WEEK.map(() => TIME_SLOTS.map(() => null));

      if (
        await backtrackSchedule(
          schedule,
          classObj.subjects,
          0,
          generatedSchedules
        )
      ) {
        generatedSchedules[classObj.name] = schedule;
      } else {
        console.log(`Could not finalize schedule for class ${classObj.name}`);
      }
    }

    console.log("Generated Schedules:");
    Object.entries(generatedSchedules).forEach(([className, schedule]) => {
      console.log(`Schedule for ${className}:`);
      schedule.forEach((day, dayIndex) => {
        console.log(`  ${DAYS_OF_WEEK[dayIndex]}:`);
        day.forEach((period, slotIndex) => {
          console.log(
            `    ${TIME_SLOTS[slotIndex]}: ${
              period ? `${period.name} - ${period.teacher}` : "Üres óra"
            }`
          );
        });
      });
    });

    setSchedules(Object.entries(generatedSchedules));
    optimizeSchedules(); // Use genetic algorithm to optimize schedules
  }, [classSchedules]);

  const backtrackSchedule = async (
    schedule,
    subjects,
    subjectIndex,
    allSchedules
  ) => {
    if (subjectIndex >= subjects.length) {
      for (let day = 0; day < DAYS_OF_WEEK.length; day++) {
        for (let slot = TIME_SLOTS.length - 1; slot >= 0; slot--) {
          if (schedule[day][slot] === null) {
            schedule[day][slot] = null;
          }
        }
      }
      return true;
    }

    const subject = subjects[subjectIndex];
    const neededOccurrences = subject.quantity;
    let currentOccurrences = 0;

    const days = shuffleArray([...Array(DAYS_OF_WEEK.length).keys()]);
    const slots = shuffleArray([...Array(TIME_SLOTS.length).keys()]);

    for (let day of days) {
      for (let slot of slots) {
        if (
          currentOccurrences < neededOccurrences &&
          canPlaceSubject(
            schedule,
            day,
            slot,
            subject,
            subject.teacherName,
            allSchedules
          )
        ) {
          if (tryPlaceSubject(schedule, day, slot, subject)) {
            currentOccurrences++;
            if (currentOccurrences === neededOccurrences) {
              if (
                await backtrackSchedule(
                  schedule,
                  subjects,
                  subjectIndex + 1,
                  allSchedules
                )
              ) {
                return true;
              }
              removeSubject(schedule, day, slot);
              currentOccurrences--;
            }
          }
        }
      }
    }

    console.log(`Failed to place all occurrences of ${subject.subjectName}`);
    return false;
  };

  const canPlaceSubject = (
    schedule,
    day,
    slot,
    subject,
    teacher,
    allSchedules
  ) => {
    if (!subject || schedule[day][slot] !== null) {
      console.log(
        `Cannot place ${subject?.subjectName} on day ${day} at slot ${slot} because it's already occupied.`
      );
      return false;
    }

    if (schedule[day].some((period) => period && period.teacher === teacher)) {
      console.log(
        `Cannot place ${subject.subjectName} on day ${day} at slot ${slot} because teacher ${teacher} is already booked in this schedule.`
      );
      return false;
    }

    if (allSchedules) {
      for (const [className, otherSchedule] of Object.entries(allSchedules)) {
        if (
          otherSchedule &&
          otherSchedule[day] &&
          otherSchedule[day][slot] &&
          otherSchedule[day][slot].teacher === teacher
        ) {
          console.log(
            `Cannot place ${subject.subjectName} on day ${day} at slot ${slot} because teacher ${teacher} is already booked in another schedule.`
          );
          return false;
        }
      }
    }

    return true;
  };

  const tryPlaceSubject = (schedule, day, slot, subject) => {
    const teacher = subject.teacherName;
    if (canPlaceSubject(schedule, day, slot, subject, teacher)) {
      schedule[day][slot] = { name: subject.subjectName, teacher: teacher };
      return true;
    }
    return false;
  };

  const removeSubject = (schedule, day, slot) => {
    schedule[day][slot] = null;
  };

  const finalConflictCheck = (schedules) => {
    const conflicts = {};

    schedules.forEach(([className, schedule]) => {
      schedule.forEach((day, dayIndex) => {
        day.forEach((period, slotIndex) => {
          if (period) {
            const teacher = period.teacher;

            schedules.forEach(([otherClassName, otherSchedule]) => {
              if (
                className !== otherClassName &&
                otherSchedule[dayIndex] &&
                otherSchedule[dayIndex][slotIndex] &&
                otherSchedule[dayIndex][slotIndex].teacher === teacher
              ) {
                conflicts[`${dayIndex}-${slotIndex}-${teacher}`] = true;
              }
            });
          }
        });
      });
    });

    setFinalConflicts(conflicts);
  };

  const optimizeSchedules = () => {
    const MAX_ITERATIONS = 1000;
    const initialTemperature = 1000;
    const coolingRate = 0.95;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      console.error("Invalid schedules array:", schedules);
      return;
    }

    let currentSchedules = [...schedules]; // Copy schedules state
    let bestSchedules = currentSchedules;
    let bestFitness = calculateFitness(currentSchedules);
    let temperature = initialTemperature;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const newSchedules = JSON.parse(JSON.stringify(currentSchedules)); // Deep copy current schedules

      // Apply Simulated Annealing move
      simulatedAnnealingMove(newSchedules);

      const newFitness = calculateFitness(newSchedules);

      if (
        newFitness > bestFitness ||
        Math.exp((newFitness - bestFitness) / temperature) > Math.random()
      ) {
        currentSchedules = newSchedules;
        bestSchedules = newSchedules;
        bestFitness = newFitness;
      }

      temperature *= coolingRate;
    }

    setSchedules(bestSchedules); // Update schedules state with the best found schedules
    finalConflictCheck(bestSchedules); // Perform final conflict check with the best schedules
  };

  const simulatedAnnealingMove = (schedules) => {
    const classIndex = Math.floor(Math.random() * schedules.length);
    const [className, schedule] = schedules[classIndex];
  
    const dayIndex = Math.floor(Math.random() * DAYS_OF_WEEK.length);
    const day = schedule[dayIndex];
  
    const filledSlots = day.map((slot, index) => slot ? index : null).filter(index => index !== null);
    const emptySlots = day.map((slot, index) => slot ? null : index).filter(index => index !== null);
  
    if (filledSlots.length > 0 && emptySlots.length > 0) {
      const filledIndex = filledSlots[Math.floor(Math.random() * filledSlots.length)];
      const emptyIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
  
      if (emptyIndex > filledIndex) {
        // Swap filled slot with empty slot to move the empty slot to the end
        const temp = day[filledIndex];
        day[filledIndex] = day[emptyIndex];
        day[emptyIndex] = temp;
      }
    }
  
    schedules[classIndex] = [className, schedule];
  };
  
  
  const calculateFitness = (schedules) => {
    let fitness = 0;
  
    schedules.forEach(([className, schedule]) => {
      schedule.forEach((day, dayIndex) => {
        let dailyTeachingHours = {};
        let lastNonEmptySlot = -1;
        let firstEmptySlotAfterLastTeaching = -1;
        let hasTeachingStarted = false;
        let subjectsSeen = new Set(); // Track subjects seen during the day
  
        day.forEach((period, slotIndex) => {
          if (period) {
            const teacher = period.teacher;
  
            hasTeachingStarted = true;
            lastNonEmptySlot = slotIndex;
  
            schedules.forEach(([otherClassName, otherSchedule]) => {
              if (
                className !== otherClassName &&
                otherSchedule[dayIndex] &&
                otherSchedule[dayIndex][slotIndex] &&
                otherSchedule[dayIndex][slotIndex].teacher === teacher
              ) {
                fitness -= 500; // Increased penalty for conflicts
              }
            });
  
            if (!dailyTeachingHours[teacher]) {
              dailyTeachingHours[teacher] = 0;
            }
            dailyTeachingHours[teacher]++;
            fitness += 10;
  
            // Check for multiple periods of the same subject on the same day
            if (subjectsSeen.has(period.name)) {
              fitness -= 200; // Penalize multiple periods of the same subject on the same day
            } else {
              subjectsSeen.add(period.name);
            }
          } else if (
            hasTeachingStarted &&
            firstEmptySlotAfterLastTeaching === -1
          ) {
            firstEmptySlotAfterLastTeaching = slotIndex;
          }
        });
  
        if (firstEmptySlotAfterLastTeaching !== -1) {
          let emptySlotsAtEnd = day.length - firstEmptySlotAfterLastTeaching;
          fitness += emptySlotsAtEnd * 15;
        }
  
        Object.values(dailyTeachingHours).forEach((hours) => {
          if (hours > 3) fitness -= 25 * (hours - 3); // Increased penalty for long teaching hours
        });
  
        // Penalize for empty slots in the middle of teaching periods
        for (let i = 0; i < day.length; i++) {
          if (day[i] === null && hasTeachingStarted) {
            if (i < lastNonEmptySlot) {
              fitness -= 50;
            }
          }
        }
      });
    });
  
    return fitness;
  };
  
  
  
  

  useEffect(() => {
    console.log("Schedules state updated:", schedules);
  }, [schedules]); // Itt a schedules az a változó amire figyelünk ha változik fut a useEffect

  const generatePdf = () => {
    const doc = new jsPDF();
    
    schedules.forEach(([className, schedule]) => {
      const title = `Órarend - ${className}`;
      doc.addPage();
      doc.text(title, 14, 20);

      const tableColumn = ["Idö", "Hétfö", "Kedd", "Szerda", "Csütörtök", "Péntek"];
      const tableRows = [];

      TIME_SLOTS.forEach((slot, slotIndex) => {
        const row = [slot];
        DAYS_OF_WEEK.forEach((day, dayIndex) => {
          const period = schedule[dayIndex][slotIndex];
          row.push(period ? `${period.name} - ${period.teacher}` : "Üres óra");
        });
        tableRows.push(row);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { halign: 'center' },
        headStyles: { fillColor: [41, 128, 185] },
      });
    });

    doc.save(`orarendek.pdf`);
  };

  return (
    <div className="div-container">
      <h2>Generálás</h2>
      <button onClick={generateSchedulesForAllClasses}>
        Összes osztály órarendjének generálása
      </button>
      <button onClick={optimizeSchedules}>Optimalizálás</button>
      <button onClick={generatePdf}>Letöltés PDF-ben</button>
      <div style={{ ...containerStyle, justifyContent: "space-between" }}>
        {Array.isArray(schedules) &&
          schedules.length > 0 &&
          schedules.map(([className, schedule], index) => (
            <div key={index} style={individualScheduleStyle}>
              <h3>{className}</h3>
              {schedule.map((day, dayIndex) => (
                <div key={dayIndex}>
                  <h4>{DAYS_OF_WEEK[dayIndex]}</h4>
                  <ul>
                    {day.map((period, slotIndex) => {
                      const isConflict =
                        finalConflicts[
                          `${dayIndex}-${slotIndex}-${period?.teacher}`
                        ];
                      const periodStyle = {
                        backgroundColor: isConflict ? "red" : "transparent",
                        color: isConflict ? "white" : "black",
                      };
                      return (
                        <li key={slotIndex} style={periodStyle}>
                          {TIME_SLOTS[slotIndex]}:{" "}
                          {period
                            ? `${period.name} - ${period.teacher}`
                            : "Üres óra"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Backtrack;
