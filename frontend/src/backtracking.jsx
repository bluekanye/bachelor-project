import React, { useState, useCallback } from "react";
import "./backtrack.css";
import { CLASS_SCHEDULES, DAYS_OF_WEEK, TIME_SLOTS, SUBJECTS } from "./data.js";

const containerStyle = {
  display: "flex",
  flexWrap: "wrap", // Engedélyezi az elemek tördelését új sorba
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
  width: "calc(20% - 20px)", // Állítsa a szélességet úgy, hogy 5 elem férjen egy sorba (100% / 5 - gap)
  marginBottom: "20px",
};

function Backtrack() {
  const [schedules, setSchedules] = useState([]);
  const [numberOfSchedules, setNumberOfSchedules] = useState(1);
  const [optimizedSchedules, setOptimizedSchedules] = useState({});
  const [optimizationMessage, setOptimizationMessage] = useState("");
  const [changes, setChanges] = useState([]);
  const [consoleMessages, setConsoleMessages] = useState([]);

  const handleScheduleCountChange = useCallback((e) => {
    setNumberOfSchedules(Math.max(1, parseInt(e.target.value, 10) || 1));
  }, []);

  const generateSchedulesForAllClasses = useCallback(() => {
    const generatedSchedules = {};

    CLASS_SCHEDULES.forEach((classObj) => {
      console.log("Subjects for class", classObj.name, classObj.subjects);
      const schedule = DAYS_OF_WEEK.map(() => TIME_SLOTS.map(() => null));

      // Órarend generálása az adott osztályhoz
      if (backtrackSchedule(schedule, classObj.subjects, 0)) {
        generatedSchedules[classObj.name] = schedule;
      } else {
        console.log(`Could not finalize schedule for class ${classObj.name}`);
      }
    });

    setOptimizedSchedules(generatedSchedules);
  }, []);

  const maxPause = 1;

  const MAX_ATTEMPTS = 1000;

  // Calculate maxOccurrence and minOccurrence once
  const maxOccurrence = Math.max(...SUBJECTS.map((subj) => subj.quantity));
  const minOccurrence = Math.min(...SUBJECTS.map((subj) => subj.quantity));

  // Tantárgyak rendezése gyakoriság alapján
  const sortedSubjects = SUBJECTS.sort((a, b) => b.quantity - a.quantity);

  function backtrackSchedule(schedule, subjects, subjectIndex = 0) {
    if (subjectIndex >= subjects.length) {
      console.log("All subjects placed successfully");
      return true;
    }
  
    // Rendezzük a tantárgyakat a legtöbbször előfordulók szerint
    subjects.sort((a, b) => b.quantity - a.quantity);
  
    const subject = subjects[subjectIndex];
    const neededOccurrences = subject.quantity;
    let currentOccurrences = 0;
  
    const shuffledDays = shuffle([...Array(DAYS_OF_WEEK.length).keys()]);
    const shuffledSlots = shuffle([...Array(TIME_SLOTS.length).keys()]);
  
    for (const day of shuffledDays) {
      for (const slot of shuffledSlots) {
        if (
          currentOccurrences < neededOccurrences &&
          canPlaceSubject(schedule, day, slot, subject, subject.teachers[0])
        ) {
          if (
            tryPlaceSubject(schedule, day, slot, subject, subject.teachers[0])
          ) {
            currentOccurrences++;
            if (currentOccurrences === neededOccurrences) {
              if (backtrackSchedule(schedule, subjects, subjectIndex + 1)) {
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
  }
  

  function canPlaceSubject(schedule, day, slot, subject, teacher) {
    if (!subject) {
      console.error("Subject is undefined at day:", day, "slot:", slot);
      return false;
    }

    if (schedule[day][slot] !== null) return false;
    // Ellenőrizzük, hogy a kiválasztott tanár már foglalt-e ebben az idősávban
    if (schedule[day].some((period) => period && period.teacher === teacher)) {
      console.log(
        `Teacher ${teacher} is already booked at day ${day}, slot ${slot}`
      );
      return false;
    }
    // Ellenőrizzük, hogy a tanár már tanít-e másik osztálynak ugyanabban az idősávban
  if (schedule.some((daySchedule) => daySchedule[slot] && daySchedule[slot].teacher === teacher)) {
    console.log(`Conflict: Teacher ${teacher} is already teaching another class at slot ${slot} on day ${day}`);
    return false;
  }
  // Ellenőrizd, hogy az előző napokon mennyi volt a terhelés
  let previousLoad = 0;
  for (let d = 0; d < day; d++) {
    if (schedule[d][slot] && schedule[d][slot].teacher === teacher) {
      previousLoad++;
    }
  }
  if (previousLoad > 2) { // Ha a tanár túl sokszor tanított már ebben az idősávban
    return false;
  }

    // Ensure the subject frequency is maintained
    if (subject.quantity === maxOccurrence) {
      // If the subject occurs the maximum number of times, ensure some pause between them
      for (let i = 1; i <= maxPause; i++) {
        if (
          day + i < DAYS_OF_WEEK.length &&
          schedule[day + i][slot] &&
          schedule[day + i][slot].quantity === minOccurrence
        ) {
          return false;
        }
        if (
          day - i >= 0 &&
          schedule[day - i][slot] &&
          schedule[day - i][slot].quantity === minOccurrence
        ) {
          return false;
        }
      }
    }

    return true;
  }

  function tryPlaceSubject(schedule, day, slot, subject) {
    const teacher = subject.teacher; // Egyértelműen hozzárendelt tanár
    if (canPlaceSubject(schedule, day, slot, subject, teacher)) {
      schedule[day][slot] = { name: subject.name, teacher: teacher };
      console.log(
        `Placed ${subject.name} with ${teacher} at day ${day}, slot ${slot}`
      );
      return true;
    }
    return false;
  }

  function removeSubject(schedule, day, slot) {
    schedule[day][slot] = null;
  }

  // Helper function to shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  
  

  const calculateFitness = useCallback((schedule) => {
    let penalty = 0;
    const MAX_DAILY_CLASSES = 6; // Egy tanár maximális napi óraszáma
    const MAX_CONSECUTIVE_CLASSES = 4; // Egy tanár legtöbb egymást követő órája
    const TEACHERS_DAY_OFF = {}; // Tanárok szabadnapjainak nyilvántartása

    // Tanárkonfliktusok és egymást követő órák figyelése
    schedule.forEach((day, dayIndex) => {
      const dailyTeacherSessions = {};

      day.forEach((period, periodIndex) => {
        if (period) {
          const teacher = period.teacher;

          // Tanár napi óraszámának számítása
          if (!dailyTeacherSessions[teacher]) {
            dailyTeacherSessions[teacher] = [];
          }
          dailyTeacherSessions[teacher].push(periodIndex);

          // Egymást követő órák büntetése
          if (
            periodIndex > 0 &&
            day[periodIndex - 1] &&
            day[periodIndex - 1].teacher === teacher
          ) {
            penalty += 100; // Egymást követő órákért büntetés
          }
        }
      });

      // Tanárkonfliktusok és napi túlterheltség ellenőrzése
      Object.entries(dailyTeacherSessions).forEach(([teacher, sessions]) => {
        // Egyszerre több helyen való "tanítás" büntetése
        if (sessions.length > 1) {
          penalty += sessions.length * 5;
        }
        // Túl sok óra egy napon büntetése
        if (sessions.length > MAX_DAILY_CLASSES) {
          penalty += (sessions.length - MAX_DAILY_CLASSES) * 10;
        }
        // Túl sok egymást követő óra büntetése
        if (sessions.length > MAX_CONSECUTIVE_CLASSES) {
          penalty += (sessions.length - MAX_CONSECUTIVE_CLASSES) * 15;
        }
        // Szabadnapok betartatása
        if (
          TEACHERS_DAY_OFF[teacher] &&
          TEACHERS_DAY_OFF[teacher].includes(dayIndex)
        ) {
          penalty += 50; // Szabadnapok megszegéséért büntetés
        }
      });
    });

    // Tantárgyak optimális eloszlásának ellenőrzése
    for (let i = 0; i < TIME_SLOTS.length; i++) {
      const subjectsInSlot = new Set();
      schedule.forEach((day) => {
        if (day[i]) {
          subjectsInSlot.add(day[i].name);
        }
      });
      // Tantárgyak ismétlődésének büntetése
      if (subjectsInSlot.size < schedule.length) {
        penalty += (schedule.length - subjectsInSlot.size) * 20;
      }
    }

    return 1000 - penalty; // Minél alacsonyabb a büntetés, annál jobb az órarend
  }, []);

  const generateNewState = useCallback((schedule) => {
    let newSchedule = JSON.parse(JSON.stringify(schedule)); // Mély másolat az órarendről

    //probalkozasok szama a cserelgeteshez 100
    for (let attempt = 0; attempt < 100; attempt++) {
      // Korlátozzuk a próbálkozások számát, hogy elkerüljük a végtelen ciklust
      // Véletlenszerű nap és idősávok kiválasztása
      const dayIndex = Math.floor(Math.random() * newSchedule.length);
      let slotIndex1 = Math.floor(Math.random() * TIME_SLOTS.length);
      let slotIndex2 = Math.floor(Math.random() * TIME_SLOTS.length);

      while (slotIndex1 === slotIndex2) {
        slotIndex2 = Math.floor(Math.random() * TIME_SLOTS.length);
      }

      // Megvizsgáljuk, hogy a cserével konfliktus keletkezik-e
      if (!createsConflict(newSchedule, dayIndex, slotIndex1, slotIndex2)) {
        // Ha nincs konfliktus, megcseréljük a periódusokat
        const temp = newSchedule[dayIndex][slotIndex1];
        newSchedule[dayIndex][slotIndex1] = newSchedule[dayIndex][slotIndex2];
        newSchedule[dayIndex][slotIndex2] = temp;
        return newSchedule; // Sikeres csere után visszatérünk az új órarenddel
      }
    }

    // Ha 100 próbálkozás után sem sikerült érvényes cserét találni, visszatérünk az eredeti órarenddel
    return schedule;
  }, []);

  const createsConflict = (schedule, dayIndex, slotIndex1, slotIndex2) => {
    const period1 = schedule[dayIndex][slotIndex1];
    const period2 = schedule[dayIndex][slotIndex2];

    // Ellenőrizzük, hogy a periodusok nem null értékek-e
    if (!period1 || !period2) return false; // Ha valamelyik null, akkor nem lehet konfliktus

    // Azonos időpontban nem lehet ugyanaz a tanár két helyen
    if (period1.teacher === period2.teacher) {
        console.log(`Konfliktus: ${period1.teacher} egyszerre két helyen tanítana.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Egy tanár ugyanabban az idősávban nem taníthat két különböző tárgyat
    if (period1.teacher === period2.teacher && period1.name !== period2.name) {
        console.log(`Konfliktus: ${period1.teacher} ugyanabban az idősávban két különböző tárgyat tanítana.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Ellenőrizzük, hogy a tanárok más idősávokban vannak-e már ezen a napon
    if (schedule[dayIndex].some(period => period && period !== period1 && period.teacher === period1.teacher)) {
        console.log(`Konfliktus: ${period1.teacher} már tanít ebben az idősávban másik osztályban.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }
    if (schedule[dayIndex].some(period => period && period !== period2 && period.teacher === period2.teacher)) {
        console.log(`Konfliktus: ${period2.teacher} már tanít ebben az idősávban másik osztályban.`);
        return period2; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Tanterem konfliktusok kezelése
    if (period1.room && period2.room && period1.room === period2.room) {
        console.log(`Konfliktus: Ugyanaz a terem (${period1.room}) két különböző osztály számára lenne foglalva.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Tantárgyak ismétlődésének ellenőrzése
    if (period1.name === period2.name) {
        console.log(`Konfliktus: Ugyanaz a tantárgy (${period1.name}) kétszer lenne azonos idősávban.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Bizonyos tárgyakat nem lehet ugyanabban az idősávban elhelyezni (itt adjuk meg ezeket a feltételeket)

    // Példa: Ha a "Matek" tantárgyat tanító tanárt ugyanabban az idősávban próbálnák elhelyezni a "Fizika" tantárgyat
    if ((period1.teacher === "Matek Tanár Neve" && period2.name === "Fizika") || (period2.teacher === "Matek Tanár Neve" && period1.name === "Fizika")) {
        console.log(`Konfliktus: A "Matek" tanár nem taníthatja egyszerre a "Fizika" tantárgyat.`);
        return period1; // Visszatérünk a konfliktus által érintett periódussal
    }

    // Egyéb ellenőrzések, szabályok hozzáadása szükség esetén

    return false; // Nincs konfliktus
};



  const simulateAnnealing = useCallback(
    (schedule) => {
      let currentSchedule = schedule;
      let currentFitness = calculateFitness(currentSchedule);
      let temperature = 600; // Initial temperature
      const coolingRate = 0.9; // Cooling rate

      while (temperature > 1) {
        let newSchedule = generateNewState(currentSchedule);
        let newFitness = calculateFitness(newSchedule);

        if (
          newFitness > currentFitness ||
          Math.exp((newFitness - currentFitness) / temperature) > Math.random()
        ) {
          currentSchedule = newSchedule;
          currentFitness = newFitness;
        }

        temperature *= coolingRate;
      }

      return currentSchedule;
    },
    [calculateFitness, generateNewState]
  );

  const optimizeSchedules = useCallback(
    (schedules) => {
      console.log("Optimalizálás kezdete.");
      setConsoleMessages(["Optimalizálás kezdete."]);
      const start = performance.now();

      const optimizedSchedules = schedules.map((schedule, index) => {
        console.log(`Órarend ${index + 1} optimalizálása...`);
        setConsoleMessages((prevMessages) => [
          ...prevMessages,
          `Órarend ${index + 1} optimalizálása...`,
        ]);
        return simulateAnnealing(schedule);
      });

      const end = performance.now();
      console.log(
        `Optimalizálás befejeződött. Időtartam: ${(end - start).toFixed(2)} ms`
      );
      setConsoleMessages((prevMessages) => [
        ...prevMessages,
        `Optimalizálás befejeződött. Időtartam: ${(end - start).toFixed(2)} ms`,
      ]);

      setSchedules(optimizedSchedules);
      setOptimizationMessage(
        `Optimalizált ${optimizedSchedules.length} órarendek. Eltelt idő: ${(
          end - start
        ).toFixed(2)} ms`
      );
    },
    [simulateAnnealing]
  );

  const generateValidSchedules = useCallback(() => {
    console.log("Generating schedules...");
    let validSchedules = [];

    let totalAttempts = 0;

    CLASS_SCHEDULES.forEach((classSchedule) => {
      let attempts = 0;
      let successful = false;
      while (!successful && attempts < MAX_ATTEMPTS) {
        let schedule = DAYS_OF_WEEK.map(() => TIME_SLOTS.map(() => null));
        if (backtrackSchedule(schedule, classSchedule.subjects)) {
          validSchedules.push(schedule);
          successful = true;
        }
        attempts++;
        totalAttempts++;
      }
      if (!successful) {
        console.log(
          `Failed to generate a valid schedule for class ${classSchedule.name} after ${MAX_ATTEMPTS} attempts.`
        );
      }
    });

    if (validSchedules.length > 0) {
      console.log("Generated schedules:", validSchedules);
      optimizeSchedules(validSchedules); // Optimize the schedules after generation
    } else {
      console.log("No valid schedules were generated.");
    }
    console.log(`Total attempts made: ${totalAttempts}`);
  }, [numberOfSchedules, optimizeSchedules]);

  return (
    <div>
      <h2>Generálás</h2>
      <label>
        Órarendek száma:
        <input
          type="number"
          value={numberOfSchedules}
          onChange={handleScheduleCountChange}
          min="1"
        />
      </label>
      <button onClick={generateSchedulesForAllClasses}>
        Összes osztály órarendjének generálása
      </button>
      <button onClick={generateValidSchedules}>Generálás</button>
      <button onClick={() => optimizeSchedules(schedules)}>
        Optimalizálás
      </button>

      {optimizationMessage && <p>{optimizationMessage}</p>}
      <div>
        {consoleMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      <div style={{ ...containerStyle, justifyContent: "space-between" }}>
        {Array.isArray(schedules) &&
          schedules.length > 0 &&
          schedules.map((schedule, index) =>
            Array.isArray(schedule) ? (
              <div key={index} style={individualScheduleStyle}>
                {schedule.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h4>{DAYS_OF_WEEK[dayIndex]}</h4>
                    <ul>
                      {day.map((period, slotIndex) => (
                        <li key={slotIndex}>
                          {TIME_SLOTS[slotIndex]}:{" "}
                          {period
                            ? `${period.name} - ${period.teacher}`
                            : "Free Period"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null
          )}
      </div>
      {changes.length > 0 && (
        <div>
          <h3>Optimalizálási változások:</h3>
          <ul>
            {changes.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Backtrack;
