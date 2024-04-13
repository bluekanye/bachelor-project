const config = require("./config");

// Creates an initial diverse population of schedules
function createInitialPopulation(size) {
  let population = [];
  for (let i = 0; i < size; i++) {
    let schedule = [];
    config.subjects.forEach(subject => {
      for (let j = 0; j < subject.quantity; j++) {
        const day = config.daysOfWeek[Math.floor(Math.random() * config.daysOfWeek.length)];
        const timeSlot = config.timeSlots[Math.floor(Math.random() * config.timeSlots.length)];
        schedule.push({ day, timeSlot, subject: subject.name, teacher: subject.teacher });
      }
    });
    population.push(schedule);
  }
  return population;
}

// function calculateFitness(schedule) {
//     let score = 1000;
//     let conflicts = 0;
//     let gaps = 0;
//     let times = {};
//     let dayUtilization = {
//         "Hétfő": new Set(),
//         "Kedd": new Set(),
//         "Szerda": new Set(),
//         "Csütörtök": new Set(),
//         "Péntek": new Set(),
//     };

//     schedule.forEach(session => {
//         const identifier = `${session.day}-${session.timeSlot}-${session.teacher}`;
//         if (times[identifier]) {
//             conflicts++;  // Teacher conflict in the same slot
//         }
//         times[identifier] = (times[identifier] || 0) + 1;
//         dayUtilization[session.day].add(session.timeSlot);
//     });

//     // Check for gaps in the schedule for each day
//     Object.keys(dayUtilization).forEach(day => {
//         let util = Array.from(dayUtilization[day]).sort();
//         for (let i = 1; i < util.length; i++) {
//             // Assuming time slots are consecutive numbers for simplicity
//             if (config.timeSlots.indexOf(util[i]) - config.timeSlots.indexOf(util[i-1]) > 1) {
//                 gaps++;
//             }
//         }
//     });

//     score -= conflicts * 100; // Higher penalty for conflicts
//     score -= gaps * 30;       // Penalty for each gap in the schedule

//     return score;
// }

function calculateFitness(schedule) {
    let score = 1000;
    let conflicts = 0;
    let gaps = 0;
    let times = {};
    let dayUtilization = {
      "Hétfő": new Set(),
      "Kedd": new Set(),
      "Szerda": new Set(),
      "Csütörtök": new Set(),
      "Péntek": new Set(),
    };
  
    schedule.forEach(session => {
      const identifier = `${session.day}-${session.timeSlot}-${session.teacher}`;
      if (times[identifier]) {
        conflicts++; // Penalty for teacher-time slot conflicts
      }
      times[identifier] = (times[identifier] || 0) + 1;
      dayUtilization[session.day].add(session.timeSlot);
    });
  
    // Calculate gaps in the schedule
    Object.keys(dayUtilization).forEach(day => {
      let util = Array.from(dayUtilization[day]).sort();
      for (let i = 1; i < util.length; i++) {
        if (config.timeSlots.indexOf(util[i]) - config.timeSlots.indexOf(util[i-1]) > 1) {
          gaps++; // Increased penalty for gaps
        }
      }
    });
  
    score -= conflicts * 100; // Higher penalty for conflicts
    score -= gaps * 30; // Higher penalty for gaps to drive tighter schedules
  
    return score;
  }
  


// function crossover(parent1, parent2) {
//     const len = parent1.length;
//     const points = [Math.floor(Math.random() * len), Math.floor(Math.random() * len), Math.floor(Math.random() * len)].sort();
    
//     const child = [
//         ...parent1.slice(0, points[0]),
//         ...parent2.slice(points[0], points[1]),
//         ...parent1.slice(points[1], points[2]),
//         ...parent2.slice(points[2])
//     ];
    
//     return child;
// }

function crossover(parent1, parent2) {
    const point1 = Math.floor(Math.random() * parent1.length);
    const point2 = Math.floor(Math.random() * (parent1.length - point1)) + point1;
    
    const child1 = [
      ...parent1.slice(0, point1),
      ...parent2.slice(point1, point2),
      ...parent1.slice(point2)
    ];
  
    const child2 = [
      ...parent2.slice(0, point1),
      ...parent1.slice(point1, point2),
      ...parent2.slice(point2)
    ];
  
    // Randomly return one of the new offspring for diversity
    return Math.random() < 0.5 ? child1 : child2;
  }
  


// // Increases mutation rate dynamically based on generation
// function mutate(schedule, generation, maxGenerations) {
//   const mutationRate = 0.1 + (0.5 - 0.1) * (generation / maxGenerations);
//   schedule.forEach(session => {
//     if (Math.random() < mutationRate) {
//       session.day = config.daysOfWeek[Math.floor(Math.random() * config.daysOfWeek.length)];
//       session.timeSlot = config.timeSlots[Math.floor(Math.random() * config.timeSlots.length)];
//     }
//   });
// }

function mutate(schedule, generation, maxGenerations) {
    // Start with a base mutation rate
    const baseMutationRate = 0.05; // Start with a smaller base mutation rate
    // Increase the mutation rate if later in the generations without improvement
    const mutationRate = baseMutationRate + (generation / maxGenerations) * 0.1;
  
    schedule.forEach(session => {
      if (Math.random() < mutationRate) {
        session.day = config.daysOfWeek[Math.floor(Math.random() * config.daysOfWeek.length)];
        session.timeSlot = config.timeSlots[Math.floor(Math.random() * config.timeSlots.length)];
      }
    });
  }
  

function runGeneticAlgorithm() {
    let population = createInitialPopulation(300);
    let generation = 0;
    let maxGenerations = 300;
    let bestFitness = 0;
    let stagnantGenerations = 0;
    let mutationRate = 0.01; // Starting mutation rate

    while (generation < maxGenerations) {
        population.sort((a, b) => calculateFitness(b) - calculateFitness(a));

        if (calculateFitness(population[0]) > bestFitness) {
            bestFitness = calculateFitness(population[0]);
            stagnantGenerations = 0; // reset counter if there's improvement
        } else {
            stagnantGenerations++;
        }

        // Increase mutation rate if there has been no improvement
        if (stagnantGenerations >= 5) {
            mutationRate = Math.min(mutationRate + 0.01, 0.1); // Cap mutation rate at 0.1
            stagnantGenerations = 0; // Reset to avoid too rapid increase
        }

        let nextGeneration = population.slice(0, 20);

        while (nextGeneration.length < population.length) {
            let parent1 = population[Math.floor(Math.random() * population.length)];
            let parent2 = population[Math.floor(Math.random() * population.length)];
            let child = crossover(parent1, parent2);
            if (Math.random() < mutationRate) mutate(child); // Apply mutation based on current rate
            nextGeneration.push(child);
        }

        population = nextGeneration;
        generation++;
    }

    return population[0];
}


const bestSolution = runGeneticAlgorithm();
console.log(`Best schedule: ${JSON.stringify(bestSolution)}`);
