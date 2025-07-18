from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from models import Car, Question

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
cars_collection = db.cars
questions_collection = db.questions
game_sessions_collection = db.game_sessions

async def init_database():
    """Initialize database with initial data"""
    
    # Check if cars already exist
    cars_count = await cars_collection.count_documents({})
    if cars_count == 0:
        # Insert initial cars
        initial_cars = [
            {
                "id": "1",
                "name": "Lightning Bolt",
                "color": "#ff4444",
                "emoji": "🏎️",
                "description": "The fastest car in the race!",
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"
            },
            {
                "id": "2",
                "name": "Thunder Strike",
                "color": "#4444ff",
                "emoji": "🚗",
                "description": "Built for speed and precision!",
                "image": "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop"
            },
            {
                "id": "3",
                "name": "Wind Rider",
                "color": "#44ff44",
                "emoji": "🚙",
                "description": "Aerodynamic and agile!",
                "image": "https://images.unsplash.com/photo-1566473179817-416c80e1ec21?w=400&h=300&fit=crop"
            }
        ]
        await cars_collection.insert_many(initial_cars)
        print("✅ Initial cars inserted")
    
    # Check if questions already exist
    questions_count = await questions_collection.count_documents({})
    if questions_count == 0:
        # Insert initial questions
        initial_questions = [
            {
                "id": "1",
                "question": "Which car manufacturer produces the Mustang?",
                "options": ["Ford", "Chevrolet", "Dodge", "Toyota"],
                "correct": 0,
                "category": "brands"
            },
            {
                "id": "2",
                "question": "What does 'MPH' stand for?",
                "options": ["Miles Per Hour", "Meters Per Hour", "Minutes Per Hour", "Miles Per Hectare"],
                "correct": 0,
                "category": "general"
            },
            {
                "id": "3",
                "question": "Which company makes the Prius?",
                "options": ["Honda", "Toyota", "Nissan", "Hyundai"],
                "correct": 1,
                "category": "brands"
            },
            {
                "id": "4",
                "question": "What is the top speed of a Bugatti Chiron?",
                "options": ["250 mph", "304 mph", "280 mph", "320 mph"],
                "correct": 1,
                "category": "speed"
            },
            {
                "id": "5",
                "question": "Which car is known as the 'Ultimate Driving Machine'?",
                "options": ["Mercedes", "BMW", "Audi", "Porsche"],
                "correct": 1,
                "category": "brands"
            },
            {
                "id": "6",
                "question": "What year was the first Ferrari produced?",
                "options": ["1940", "1947", "1935", "1952"],
                "correct": 1,
                "category": "history"
            },
            {
                "id": "7",
                "question": "Which car brand has a prancing horse logo?",
                "options": ["Lamborghini", "Ferrari", "McLaren", "Bugatti"],
                "correct": 1,
                "category": "brands"
            },
            {
                "id": "8",
                "question": "What does 'SUV' stand for?",
                "options": ["Super Urban Vehicle", "Sport Utility Vehicle", "Speed Up Vehicle", "Standard Urban Vehicle"],
                "correct": 1,
                "category": "general"
            },
            {
                "id": "9",
                "question": "Which car manufacturer is known for the 911 model?",
                "options": ["BMW", "Mercedes", "Audi", "Porsche"],
                "correct": 3,
                "category": "brands"
            },
            {
                "id": "10",
                "question": "What is the fastest production car in the world?",
                "options": ["Bugatti Chiron", "Koenigsegg Jesko", "McLaren Speedtail", "Hennessey Venom F5"],
                "correct": 1,
                "category": "speed"
            },
            {
                "id": "11",
                "question": "Which car manufacturer created the Model T?",
                "options": ["General Motors", "Ford", "Chrysler", "Studebaker"],
                "correct": 1,
                "category": "history"
            },
            {
                "id": "12",
                "question": "What does 'ABS' stand for in car safety?",
                "options": ["Anti-Brake System", "Anti-Lock Braking System", "Automatic Brake System", "Advanced Brake System"],
                "correct": 1,
                "category": "general"
            },
            {
                "id": "13",
                "question": "Which luxury car brand is owned by Volkswagen?",
                "options": ["Mercedes-Benz", "BMW", "Audi", "Lexus"],
                "correct": 2,
                "category": "brands"
            },
            {
                "id": "14",
                "question": "What is the minimum age to get a driver's license in most US states?",
                "options": ["15", "16", "17", "18"],
                "correct": 1,
                "category": "general"
            },
            {
                "id": "15",
                "question": "Which car holds the record for the highest speed ever achieved by a car?",
                "options": ["Bugatti Chiron", "Koenigsegg Agera RS", "Hennessey Venom GT", "ThrustSSC"],
                "correct": 3,
                "category": "speed"
            }
        ]
        await questions_collection.insert_many(initial_questions)
        print("✅ Initial questions inserted")
    
    print("🚀 Database initialization complete!")