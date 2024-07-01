// class Class {
//     constructor(name, subjects) {
//       this.name = name;
//       this.subjects = subjects.map(subjectName => {
//           const subject = SUBJECTS.find(subject => subject.name.toLowerCase() === subjectName.toLowerCase());
//           if (!subject) {
//               console.error(`No subject found for name: ${subjectName}`);
//               return null;
//           }
//           return subject;
//       }).filter(subject => subject != null); // Ez kihagyja azokat a tárgyakat, amelyek nem találhatók meg
//     }
// }

class Class {
  constructor(name, subjectTeacherPairs) {
    this.name = name;
    this.subjects = subjectTeacherPairs
      .map(({ subjectName, teacherName }) => {
        const subject = SUBJECTS.find(
          (subject) => subject.name.toLowerCase() === subjectName.toLowerCase()
        );
        if (!subject) {
          console.error(`No subject found for name: ${subjectName}`);
          return null;
        }
        return { ...subject, teacher: teacherName };
      })
      .filter((subject) => subject != null); // Ez kihagyja azokat a tárgyakat, amelyek nem találhatók meg, és a tanár hozzárendeléseket is kezeli
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
  
];
// export const CLASS_SCHEDULES = ["1.A","1.B","2.A","2.B"];

// Subjects
export const SUBJECTS = [
  new Subject("Matematika", ["László Kovács", "Anna Szabó"],2),
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
  new Subject("Polgári", ["Ádám Tóth"], 1),
  new Subject("Ora1", ["Krisztina Molnár"], 1),
  new Subject("Ora2", ["Zsolt Ferenczi"], 1),
  new Subject("Ora3", ["Ferenc Török"], 1),
  new Subject("Ora4", ["Zsolt Papp"], 1),
  new Subject("Ora5", ["Anna László"], 1),
  new Subject("Ora6", ["Krisztián Molnár"], 1),
  new Subject("Hitoktatás", ["Szentlélek István"], 1),

  // További tantárgyak...
];

// Classes
//oreg kod jol mukodik
// export const CLASS_SCHEDULES = [
//   new Class("1.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   new Class("1.B",  ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   new Class("2.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   new Class("2.B",  ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//    new Class("3.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//    new Class("3.B", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("4.A", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("4.B", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("4.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("3.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("2.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),
//   //  new Class("1.C", ["Matematika", "Fizika", "Történelem", "Földrajz", "Magyar", "Szlovák", "Angol", "Német", "Torna", "Informatika", "Kémia", "Biológia", "Spanyol", "Francia", "Polgári","Ora1","ora2","ora3","ora4","ora5","ora6"]),

// ];
export const CLASS_SCHEDULES = [
  new Class("1.A", [
    { subjectName: "Matematika", teacherName: "László Kovács" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Éva Nagy" },
    { subjectName: "Szlovák", teacherName: "Éva Nagy" },
    { subjectName: "Angol", teacherName: "Péter Kiss" },
    { subjectName: "Német", teacherName: "Péter Kiss" },
    { subjectName: "Torna", teacherName: "Zsolt Farkas" },
    { subjectName: "Informatika", teacherName: "Pavol Grün" },
    { subjectName: "Kémia", teacherName: "Tamás Balogh" },
    { subjectName: "Biológia", teacherName: "Ingrid Zóld" },
    { subjectName: "Spanyol", teacherName: "Ádám Fehér" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
    // További tárgyak...
  ]),
  // További osztályok...
  new Class("1.B", [
    { subjectName: "Matematika", teacherName: "Anna Szabó" },
    { subjectName: "Fizika", teacherName: "Anna Szabó" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "István Horváth" },
    { subjectName: "Szlovák", teacherName: "István Horváth" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),
  new Class("2.A", [
    { subjectName: "Matematika", teacherName: "László Kovács" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Éva Nagy" },
    { subjectName: "Szlovák", teacherName: "Éva Nagy" },
    { subjectName: "Angol", teacherName: "Péter Kiss" },
    { subjectName: "Német", teacherName: "Péter Kiss" },
    { subjectName: "Torna", teacherName: "Zsolt Farkas" },
    { subjectName: "Informatika", teacherName: "Pavol Grün" },
    { subjectName: "Kémia", teacherName: "Tamás Balogh" },
    { subjectName: "Biológia", teacherName: "Ingrid Zóld" },
    { subjectName: "Spanyol", teacherName: "Ádám Fehér" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),
  new Class("2.B", [
    { subjectName: "Matematika", teacherName: "Anna Szabó" },
    { subjectName: "Fizika", teacherName: "Anna Szabó" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "István Horváth" },
    { subjectName: "Szlovák", teacherName: "István Horváth" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),

  new Class("3.A", [
    { subjectName: "Matematika", teacherName: "László Kovács" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Éva Nagy" },
    { subjectName: "Szlovák", teacherName: "Éva Nagy" },
    { subjectName: "Angol", teacherName: "Péter Kiss" },
    { subjectName: "Német", teacherName: "Péter Kiss" },
    { subjectName: "Torna", teacherName: "Zsolt Farkas" },
    { subjectName: "Informatika", teacherName: "Pavol Grün" },
    { subjectName: "Kémia", teacherName: "Tamás Balogh" },
    { subjectName: "Biológia", teacherName: "Ingrid Zóld" },
    { subjectName: "Spanyol", teacherName: "Ádám Fehér" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
    // További tárgyak...
  ]),

  new Class("3.B", [
    { subjectName: "Matematika", teacherName: "László Kovács" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Mária Varga" },
    { subjectName: "Szlovák", teacherName: "Mária Varga" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),


  new Class("3.C", [
    { subjectName: "Matematika", teacherName: "Anna Szabó" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Mária Varga" },
    { subjectName: "Szlovák", teacherName: "Mária Varga" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),

  new Class("3.G", [
    { subjectName: "Matematika", teacherName: "Anna Szabó" },
    { subjectName: "Fizika", teacherName: "Anna Szabó" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Mária Varga" },
    { subjectName: "Szlovák", teacherName: "Mária Varga" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),

  new Class("3.F", [
    { subjectName: "Matematika", teacherName: "Anna Szabó" },
    { subjectName: "Fizika", teacherName: "Anna Szabó" },
    { subjectName: "Történelem", teacherName: "toritanar" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Mária Varga" },
    { subjectName: "Szlovák", teacherName: "Mária Varga" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
    { subjectName: "Német", teacherName: "Katalin Németh" },
    { subjectName: "Torna", teacherName: "Judit Papp" },
    { subjectName: "Informatika", teacherName: "Nagy Mária" },
    { subjectName: "Kémia", teacherName: "Bence Török" },
    { subjectName: "Biológia", teacherName: "Zsolt Fóthy" },
    { subjectName: "Spanyol", teacherName: "Áron Katona" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
  ]),
  new Class("4.A", [
    { subjectName: "Matematika", teacherName: "László Kovács" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Éva Nagy" },
    { subjectName: "Szlovák", teacherName: "Éva Nagy" },
    { subjectName: "Angol", teacherName: "Péter Kiss" },
    { subjectName: "Német", teacherName: "Péter Kiss" },
    { subjectName: "Torna", teacherName: "Zsolt Farkas" },
    { subjectName: "Informatika", teacherName: "Pavol Grün" },
    { subjectName: "Kémia", teacherName: "Tamás Balogh" },
    { subjectName: "Biológia", teacherName: "Ingrid Zóld" },
    { subjectName: "Spanyol", teacherName: "Ádám Fehér" },
    { subjectName: "Francia", teacherName: "Gergely Fekete" },
    { subjectName: "Polgári", teacherName: "Ádám Tóth" },
    { subjectName: "Ora1", teacherName: "Krisztina Molnár" },
    { subjectName: "Ora2", teacherName: "Zsolt Ferenczi" },
    { subjectName: "Ora3", teacherName: "Bence Török" },
    { subjectName: "Ora4", teacherName: "Zsolt Papp" },
    { subjectName: "Ora5", teacherName: "Anna László" },
    { subjectName: "Ora6", teacherName: "Krisztián Molnár" },
    { subjectName: "Hitoktatás", teacherName: "Szentlélek István" },
    // További tárgyak...
  ]),

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
