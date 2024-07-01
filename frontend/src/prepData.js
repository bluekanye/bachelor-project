// Define the Subject class
class Subject {
    constructor(name, teachers, quantity) {
      this.name = name;
      this.teachers = teachers;
      this.quantity = quantity;
    }
  }
  
  // Define the Class class
  class Class {
    constructor(name, subjects) {
      this.name = name;
      this.subjects = subjects.map(({ subjectName, teacherName }) => {
        const subject = SUBJECTS.find(
          (subject) => subject.name.toLowerCase() === subjectName.toLowerCase()
        );
        if (!subject) {
          console.error(`No subject found for name: ${subjectName}`);
          return null;
        }
        return { ...subject, teacher: teacherName };
      }).filter(subject => subject != null); // Ez kihagyja azokat a tárgyakat, amelyek nem találhatók meg, és a tanár hozzárendeléseket is kezeli
    }
  }
  
  // Constants
  export const DAYS_OF_WEEK = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
  export const TIME_SLOTS = [
    "7:50-8:35",
    "8:45-9:30",
    "9:40-10:25",
    "10:45-11:30",
    "11:40-12:25",
    "12:35-13:20",
    "13:30-14:15",
  ];
  
  // Subjects
  export const SUBJECTS = [
    new Subject("Matematika", ["László Kovács", "Anna Szabó"], 3),
    new Subject("Fizika", ["László Kovács", "Anna Szabó"], 1),
    new Subject("Történelem", ["Gábor Tóth", "toritanar"], 2),
    new Subject("Földrajz", ["Zsolt Farkas"], 1),
    new Subject("Magyar", ["Éva Nagy", "István Horváth", "Mária Varga"], 3),
    new Subject("Szlovák", ["Éva Nagy", "István Horváth", "Mária Varga"], 2),
    new Subject("Angol", ["Péter Kiss", "Katalin Németh"], 3),
    new Subject("Német", ["Péter Kiss", "Katalin Németh"], 2),
    new Subject("Torna", ["Zsolt Farkas", "Judit Papp"], 2),
    new Subject("Informatika", ["Pavol Grün", "Nagy Mária"], 1),
    new Subject("Kémia", ["Tamás Balogh", "Bence Török"], 2),
    new Subject("Biológia", ["Ingrid Zóld", "Zsolt Fóthy"], 1),
    new Subject("Spanyol", ["Ádám Fehér", "Áron Katona"], 2),
    new Subject("Francia", ["Gergely Fekete"], 1),
    new Subject("Polgári", ["Gábor Tóth"], 1),
    new Subject("Ora1", ["Krisztina Molnár"], 1),
    new Subject("Ora2", ["Zsolt Ferenczi"], 1),
    new Subject("Ora3", ["Bence Török"], 2),
    new Subject("Ora4", ["Zsolt Papp"], 1),
    new Subject("Ora5", ["Anna László"], 1),
    new Subject("Ora6", ["Krisztián Molnár"], 1),
    new Subject("Hitoktatás", ["Szentlélek István"], 1),
  ];
  
  // Generate CLASS_SCHEDULES automatically
  const generateClassSchedules = () => {
    const classSchedules = [];
  
    const numberOfClasses = 10; // Például, 10 osztály
    for (let i = 0; i < numberOfClasses; i++) {
      const className = `Class ${i + 1}`;
      const subjects = SUBJECTS.map(subject => {
        const teacher = subject.teachers[Math.floor(Math.random() * subject.teachers.length)];
        return { subjectName: subject.name, teacherName: teacher };
      });
      classSchedules.push(new Class(className, subjects));
    }
    return classSchedules;
  };
  
  // Create the class schedules with the specified number of classes
  export const CLASS_SCHEDULES = generateClassSchedules();
  
  // Example of logging the generated schedules to the console
  CLASS_SCHEDULES.forEach((classSchedule) => {
    console.log(`Schedule for ${classSchedule.name}:`);
    classSchedule.subjects.forEach((subject) => {
      console.log(`${subject.name} - Teacher: ${subject.teacher}, Quantity: ${subject.quantity}`);
    });
  });
  