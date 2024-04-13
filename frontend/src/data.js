class Class {
    constructor(name, subjects) {
      this.name = name;
      this.subjects = subjects.map(subjectName => {
          const subject = SUBJECTS.find(subject => subject.name.toLowerCase() === subjectName.toLowerCase());
          if (!subject) {
              console.error(`No subject found for name: ${subjectName}`);
              return null;
          }
          return subject;
      }).filter(subject => subject != null); // Ez kihagyja azokat a tárgyakat, amelyek nem találhatók meg
    }
}

  
  
class Subject {
    constructor(name, teachers, quantity) {
      this.name = name;
      this.teachers = teachers; // Most már több tanár is tárolható egy tömbben
      this.quantity = quantity;
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
  "14:25-15:10",
  
];
// export const CLASS_SCHEDULES = ["1.A","1.B","2.A","2.B"];


// Subjects
export const SUBJECTS = [
    new Subject("Matematika", ["Tanár 1", "tanar 2"], 2),
    new Subject("Fizika", ["Tanár 1","tanar 2"], 1),
    new Subject("Történelem", ["Tanár 3","toritanar"], 2),
    new Subject("Földrajz", ["Tanár 8"], 1),
    new Subject("Magyar", ["Tanár 4", "tanar 96","tanar 100"], 4),
    new Subject("Szlovák", ["Tanár 4", "tanar 96","tanar 100"], 4),
    new Subject("Angol", ["Tanár 6","tanar 220"], 3),
    new Subject("Német", ["Tanár 6","tanar 220"], 3),
    new Subject("Torna", ["Tanár 8","tanar 915"], 2),
    new Subject("Informatika", ["Tanár 9","tanar info"], 2),
    new Subject("Kémia", ["Tanár 10"], 1),
    new Subject("Biológia", ["Tanár 11"], 1),
    new Subject("Spanyol", ["Tanár 12"], 1),
    new Subject("Francia", ["Tanár 13"], 1),
    new Subject("Polgári", ["Tanár B"], 1),
    new Subject("Ora1", ["Tanár 14"], 1),
    new Subject("Ora2", ["Tanár 15"], 1),
    new Subject("Ora3", ["Tanár 16"], 1),
    new Subject("Ora4",[ "Tanár 17"], 1),
    new Subject("Ora5", ["Tanár 18"], 1),
    new Subject("Ora6", ["Tanár 19"], 1),

    // További tantárgyak...
  ];
  
  // Classes
  export const CLASS_SCHEDULES = [
    new Class("1.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
    new Class("1.B",  ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
    new Class("2.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
    new Class("2.B",  ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("3.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("3.B", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("4.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("4.B", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("4.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("3.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("2.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     new Class("1.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
     
  ];


// // Subjects
// export const SUBJECTS = [
//   { name: "Matematika", teacher: "Tanár 1", quantity: 2 },
//   { name: "Fizika", teacher: "Tanár 1", quantity: 1 },
//   { name: "Fizika1", teacher: "Tanár 20", quantity: 1 },
//   { name: "Fizika2", teacher: "Tanár 21", quantity: 1 },
//   { name: "Fizika3", teacher: "Tanár22", quantity: 1 },
//   { name: "Fizika4", teacher: "Tanár 23", quantity: 1 },
//   { name: "Fizika5", teacher: "Tanár 24", quantity: 1 },
//   { name: "Fizika6", teacher: "Tanár 52", quantity: 1 },
//   { name: "Fizika7", teacher: "Tanár 25", quantity: 1 },
//   { name: "Fizika8", teacher: "Tanár 66", quantity: 1 },
//   { name: "Fizika9", teacher: "Tanár 55", quantity: 1 },
//   { name: "Fizika10", teacher: "Tanár 75", quantity: 1 },
//   { name: "Matematika2", teacher: "Tanár 2", quantity: 2 },
//   { name: "Fizika2", teacher: "Tanár 2", quantity: 1 },
//   { name: "Történelem", teacher: "Tanár 3", quantity: 2 },
//   { name: "Történelem2", teacher: "Tanár 13", quantity: 2 },
//   { name: "Polgari", teacher: "Tanár B", quantity: 1 },
//   { name: "Foldrajz", teacher: "Tanár 4", quantity: 1 },
//   { name: "Magyar", teacher: "Tanár 4", quantity: 2 },
//   { name: "Szlovak", teacher: "Tanár 5", quantity: 2 },
//   { name: "Magyar2", teacher: "Tanár 5", quantity: 2 },
//   { name: "Szlovak2", teacher: "Tanár 6", quantity: 2 },
//   { name: "Angol", teacher: "Tanár 6", quantity: 2 },
//   { name: "Nemet", teacher: "Tanár 7", quantity: 2 },
//   { name: "Angol2", teacher: "Tanár 7", quantity: 2 },
//   { name: "Nemet2", teacher: "Tanár 8", quantity: 2 },
//   { name: "Torna", teacher: "Tanár 8", quantity: 2 },
//   { name: "Torna2", teacher: "Tanár 82", quantity: 2 },
//   { name: "Torna3", teacher: "Tanár 81", quantity: 2 },
//   { name: "Informatika", teacher: "Tanár 9", quantity: 2 },
//   { name: "Kemia", teacher: "Tanár 9", quantity: 1 },
//   { name: "Biologia", teacher: "Tanár 10", quantity: 1 },
//   { name: "Kemia2", teacher: "Tanár 10", quantity: 1 },
//   { name: "Biologia2", teacher: "Tanár 11", quantity: 1 },
//   { name: "Spanyol", teacher: "Tanár 11", quantity: 1 },
//   { name: "Francia", teacher: "Tanár 12", quantity: 1 },
//   { name: "Francia2", teacher: "Tanár 12", quantity: 1 },
// ];