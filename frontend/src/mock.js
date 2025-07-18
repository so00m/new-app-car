// Mock data for the car racing quiz game

export const cars = [
  {
    id: 1,
    name: "Lightning Bolt",
    color: "#ff4444",
    emoji: "🏎️",
    description: "The fastest car in the race!",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"
  },
  {
    id: 2, 
    name: "Thunder Strike",
    color: "#4444ff",
    emoji: "🚗",
    description: "Built for speed and precision!",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Wind Rider",
    color: "#44ff44", 
    emoji: "🚙",
    description: "Aerodynamic and agile!",
    image: "https://images.unsplash.com/photo-1566473179817-416c80e1ec21?w=400&h=300&fit=crop"
  }
];

export const questions = [
  {
    id: 1,
    question: "Which car manufacturer produces the Mustang?",
    options: ["Ford", "Chevrolet", "Dodge", "Toyota"],
    correct: 0
  },
  {
    id: 2,
    question: "What does 'MPH' stand for?",
    options: ["Miles Per Hour", "Meters Per Hour", "Minutes Per Hour", "Miles Per Hectare"],
    correct: 0
  },
  {
    id: 3,
    question: "Which company makes the Prius?",
    options: ["Honda", "Toyota", "Nissan", "Hyundai"],
    correct: 1
  },
  {
    id: 4,
    question: "What is the top speed of a Bugatti Chiron?",
    options: ["250 mph", "304 mph", "280 mph", "320 mph"],
    correct: 1
  },
  {
    id: 5,
    question: "Which car is known as the 'Ultimate Driving Machine'?",
    options: ["Mercedes", "BMW", "Audi", "Porsche"],
    correct: 1
  },
  {
    id: 6,
    question: "What year was the first Ferrari produced?",
    options: ["1940", "1947", "1935", "1952"],
    correct: 1
  },
  {
    id: 7,
    question: "Which car brand has a prancing horse logo?",
    options: ["Lamborghini", "Ferrari", "McLaren", "Bugatti"],
    correct: 1
  },
  {
    id: 8,
    question: "What does 'SUV' stand for?",
    options: ["Super Urban Vehicle", "Sport Utility Vehicle", "Speed Up Vehicle", "Standard Urban Vehicle"],
    correct: 1
  },
  {
    id: 9,
    question: "Which car manufacturer is known for the 911 model?",
    options: ["BMW", "Mercedes", "Audi", "Porsche"],
    correct: 3
  },
  {
    id: 10,
    question: "What is the fastest production car in the world?",
    options: ["Bugatti Chiron", "Koenigsegg Jesko", "McLaren Speedtail", "Hennessey Venom F5"],
    correct: 1
  }
];

export const raceTrackLength = 100; // Total distance to finish line
export const moveDistance = 10; // Distance moved per correct answer