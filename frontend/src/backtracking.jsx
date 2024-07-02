import React, { useState, useEffect, useCallback } from "react";
import "./backtrack.css";
import { CLASS_SCHEDULES, DAYS_OF_WEEK, TIME_SLOTS, SUBJECTS } from "./data.js";

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

function Backtrack() {
  const [schedules, setSchedules] = useState([]);
  const [finalConflicts, setFinalConflicts] = useState({});

  const generateSchedulesForAllClasses = useCallback(async () => {
    const generatedSchedules = {};
  
    for (const classObj of CLASS_SCHEDULES) {
      console.log("Generating schedule for class", classObj.name);
      const schedule = DAYS_OF_WEEK.map(() => TIME_SLOTS.map(() => null));
  
      if (await backtrackSchedule(schedule, classObj.subjects, 0, generatedSchedules)) {
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
          console.log(`    ${TIME_SLOTS[slotIndex]}: ${period ? `${period.name} - ${period.teacher}` : "Empty slot"}`);
        });
      });
    });
  
    setSchedules(Object.entries(generatedSchedules));
    optimizeSchedules(); // Use genetic algorithm to optimize schedules
  }, []);
  

  const backtrackSchedule = async (schedule, subjects, subjectIndex, allSchedules) => {
    if (subjectIndex >= subjects.length) {
      return true;
    }

    const subject = subjects[subjectIndex];
    const neededOccurrences = subject.quantity;
    let currentOccurrences = 0;

    const days = shuffleArray([...Array(DAYS_OF_WEEK.length).keys()]);
    const slots = shuffleArray([...Array(TIME_SLOTS.length).keys()]);

    for (let day of days) {
      for (let slot of slots) {
        if (currentOccurrences < neededOccurrences && canPlaceSubject(schedule, day, slot, subject, subject.teacher, allSchedules)) {
          if (tryPlaceSubject(schedule, day, slot, subject)) {
            currentOccurrences++;
            if (currentOccurrences === neededOccurrences) {
              if (await backtrackSchedule(schedule, subjects, subjectIndex + 1, allSchedules)) {
                return true;
              }
              removeSubject(schedule, day, slot);
              currentOccurrences--;
            }
          }
        }
      }
    }

    console.log(`Failed to place all occurrences of ${subject.name}`);
    return false;
  };
  
 const canPlaceSubject = (schedule, day, slot, subject, teacher, allSchedules) => {
  if (!subject || schedule[day][slot] !== null) {
    console.log(`Cannot place ${subject?.name} on day ${day} at slot ${slot} because it's already occupied.`);
    return false;
  }

  if (schedule[day].some((period) => period && period.teacher === teacher)) {
    console.log(`Cannot place ${subject.name} on day ${day} at slot ${slot} because teacher ${teacher} is already booked in this schedule.`);
    return false;
  }

  if (allSchedules) {
    for (const [className, otherSchedule] of Object.entries(allSchedules)) {
      if (otherSchedule && otherSchedule[day] && otherSchedule[day][slot] && otherSchedule[day][slot].teacher === teacher) {
        console.log(`Cannot place ${subject.name} on day ${day} at slot ${slot} because teacher ${teacher} is already booked in another schedule.`);
        return false;
      }
    }
  }

  return true;
};

  const tryPlaceSubject = (schedule, day, slot, subject) => {
    const teacher = subject.teacher;
    if (canPlaceSubject(schedule, day, slot, subject, teacher)) {
      schedule[day][slot] = { name: subject.name, teacher: teacher };
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
              if (className !== otherClassName && otherSchedule[dayIndex] && otherSchedule[dayIndex][slotIndex] && otherSchedule[dayIndex][slotIndex].teacher === teacher) {
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
    const coolingRate = 0.99;
  
    if (!Array.isArray(schedules) || schedules.length === 0) {
      console.error('Invalid schedules array:', schedules);
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
  
      if (newFitness > bestFitness || Math.exp((newFitness - bestFitness) / temperature) > Math.random()) {
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
    const classIndex1 = Math.floor(Math.random() * schedules.length);
    const classIndex2 = Math.floor(Math.random() * schedules.length);

    const [className1, schedule1] = schedules[classIndex1];
    const [className2, schedule2] = schedules[classIndex2];

    const dayIndex1 = Math.floor(Math.random() * DAYS_OF_WEEK.length);
    const slotIndex1 = Math.floor(Math.random() * TIME_SLOTS.length);
    const dayIndex2 = Math.floor(Math.random() * DAYS_OF_WEEK.length);
    const slotIndex2 = Math.floor(Math.random() * TIME_SLOTS.length);

    // Try to optimize by moving empty slots to the end of the day
    if (!schedule1[dayIndex1][slotIndex1] && schedule2[dayIndex2][slotIndex2]) {
        if (slotIndex2 > slotIndex1) {  // Move empty slot to a later time if possible
            const temp = schedule1[dayIndex1][slotIndex1];
            schedule1[dayIndex1][slotIndex1] = schedule2[dayIndex2][slotIndex2];
            schedule2[dayIndex2][slotIndex2] = temp;
        }
    }

    schedules[classIndex1] = [className1, schedule1];
    schedules[classIndex2] = [className2, schedule2];
};

  
  const calculateFitness = (schedules) => {
    let fitness = 0;

    schedules.forEach(([className, schedule]) => {
        schedule.forEach((day, dayIndex) => {
            let dailyTeachingHours = {};
            let emptySlotsEarlyPenalty = 0;
            let lastNonEmptySlot = -1;

            day.forEach((period, slotIndex) => {
                if (period) {
                    const teacher = period.teacher;

                    // Penalize conflicts where teachers are double-booked
                    schedules.forEach(([otherClassName, otherSchedule]) => {
                        if (className !== otherClassName && otherSchedule[dayIndex] && otherSchedule[dayIndex][slotIndex] && otherSchedule[dayIndex][slotIndex].teacher === teacher) {
                            fitness -= 200; // Major penalty for conflicts
                        }
                    });

                    // Track daily teaching hours for distribution penalty
                    if (!dailyTeachingHours[teacher]) {
                        dailyTeachingHours[teacher] = 0;
                    }
                    dailyTeachingHours[teacher]++;
                    lastNonEmptySlot = slotIndex; // Update last non-empty slot

                    // Bonus for having a subject
                    fitness += 5;
                } else {
                    // Calculate penalty for early empty slots
                    if (slotIndex < lastNonEmptySlot) {
                        emptySlotsEarlyPenalty += 10;
                    }
                }
            });

            // Penalize uneven distribution of teaching hours
            Object.values(dailyTeachingHours).forEach(hours => {
                if (hours > 3) fitness -= 10 * (hours - 3);
            });

            // Apply early empty slot penalty
            fitness -= emptySlotsEarlyPenalty;
        });
    });

    return fitness;
};

  

  useEffect(() => {
    console.log("Schedules state updated:", schedules);
  }, [schedules]); // Itt a schedules az a változó amire figyelünk ha változik fut a useEffect
  

  return (
    <div className="div-container">
      <h2>Generálás</h2>
      <button onClick={generateSchedulesForAllClasses}>
        Összes osztály órarendjének generálása
      </button>
      <button onClick={optimizeSchedules}>
        Optimalizálás
      </button>
      <div style={{ ...containerStyle, justifyContent: "space-between" }}>
        {Array.isArray(schedules) && schedules.length > 0 && schedules.map(([className, schedule], index) => (
          <div key={index} style={individualScheduleStyle}>
            <h3>{className}</h3>
            {schedule.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h4>{DAYS_OF_WEEK[dayIndex]}</h4>
                <ul>
                  {day.map((period, slotIndex) => {
                    const isConflict = finalConflicts[`${dayIndex}-${slotIndex}-${period?.teacher}`];
                    const periodStyle = {
                      backgroundColor: isConflict ? 'red' : 'transparent',
                      color: isConflict ? 'white' : 'black'
                    };
                    return (
                      <li key={slotIndex} style={periodStyle}>
                        {TIME_SLOTS[slotIndex]}: {period ? `${period.name} - ${period.teacher}` : "Üres óra"}
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
