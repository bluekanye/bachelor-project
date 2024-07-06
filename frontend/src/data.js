

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
      .filter((subject) => subject != null); 
  }
}

class Subject {
  constructor(name, teachers, quantity) {
    this.name = name;
    this.teachers = teachers; 
    this.quantity = quantity;
  }
}



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
  new Subject("Matematika", ["László Kovács", "Anna Szabó","Töltött Márton"],1),
  new Subject("Fizika", ["László Kovács", "Anna Szabó"], 1),
  new Subject("Történelem", ["Gábor Tóth", "toritanar"], 1),
  new Subject("Földrajz", ["Zsolt Farkas"], 1),
  new Subject("Magyar", ["Éva Nagy", "István Horváth", "Mária Varga", "Töltött Márton"], 2),
  new Subject("Szlovák", ["Éva Nagy", "István Horváth", "Mária Varga" , "Töltött Márton"], 1),
  new Subject("Angol", ["Péter Kiss", "Katalin Németh"], 1),
  new Subject("Német", ["Péter Kiss", "Katalin Németh"], 1),
  new Subject("Torna", ["Zsolt Farkas", "Judit Papp"], 1),
  new Subject("Informatika", ["Pavol Grün", "Nagy Mária"], 1),
  new Subject("Kémia", ["Tamás Balogh", "Bence Török"], 1),
  new Subject("Biológia", ["Ingrid Zóld", "Zsolt Fóthy"], 2),
  new Subject("Spanyol", ["Ádám Fehér", "Áron Katona"], 1),
  new Subject("Francia", ["Gergely Fekete"], 2),
  new Subject("Polgári", ["Ádám Tóth"], 2),
  new Subject("Ora1", ["Krisztina Molnár"], 2),
  new Subject("Ora2", ["Zsolt Ferenczi"], 2),
  new Subject("Ora3", ["Ferenc Török"], 2),
  new Subject("Ora4", ["Zsolt Papp"],2),
  new Subject("Ora5", ["Anna László"], 2),
  new Subject("Ora6", ["Krisztián Molnár"], 2),
  new Subject("Hitoktatás", ["Szentlélek István"], 2),

  
];


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
    
  ]),
  
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
    { subjectName: "Matematika", teacherName: "Töltött Márton" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Éva Nagy" },
    { subjectName: "Szlovák", teacherName: "Éva Nagy" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
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
  new Class("4.B", [
    { subjectName: "Matematika", teacherName: "Töltött Márton" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Töltött Márton" },
    { subjectName: "Szlovák", teacherName: "Töltött Márton" },
    { subjectName: "Angol", teacherName: "Katalin Németh" },
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
    new Class("4.C", [
    { subjectName: "Matematika", teacherName: "Töltött Márton" },
    { subjectName: "Fizika", teacherName: "László Kovács" },
    { subjectName: "Történelem", teacherName: "Gábor Tóth" },
    { subjectName: "Földrajz", teacherName: "Zsolt Farkas" },
    { subjectName: "Magyar", teacherName: "Töltött Márton" },
    { subjectName: "Szlovák", teacherName: "Töltött Márton" },
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
];
