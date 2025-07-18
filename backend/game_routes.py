from fastapi import APIRouter, HTTPException
from models import Car, Question, GameSession, GameSessionCreate, GameAnswer, LeaderboardEntry
from database import cars_collection, questions_collection, game_sessions_collection
from typing import List
import random
from datetime import datetime

router = APIRouter()

@router.get("/cars", response_model=List[Car])
async def get_cars():
    """Get all available cars"""
    cars = await cars_collection.find().to_list(1000)
    return [Car(**car) for car in cars]

@router.get("/questions", response_model=List[Question])
async def get_questions(limit: int = 10):
    """Get random questions for a game"""
    # Get all questions and randomly select specified number
    all_questions = await questions_collection.find().to_list(1000)
    
    if len(all_questions) < limit:
        # If we don't have enough questions, return all
        selected_questions = all_questions
    else:
        # Randomly select questions
        selected_questions = random.sample(all_questions, limit)
    
    return [Question(**q) for q in selected_questions]

@router.post("/game-session", response_model=GameSession)
async def create_game_session(session_data: GameSessionCreate):
    """Create a new game session"""
    # Verify car exists
    car = await cars_collection.find_one({"id": session_data.selected_car_id})
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Get random questions for this session
    questions = await get_questions(10)  # Get 10 questions
    question_ids = [q.id for q in questions]
    
    # Create game session
    game_session = GameSession(
        player_name=session_data.player_name,
        selected_car_id=session_data.selected_car_id,
        questions=question_ids,
        current_question=0,
        score=0,
        position=0,
        answers=[],
        is_completed=False,
        is_winner=False
    )
    
    # Insert into database
    await game_sessions_collection.insert_one(game_session.dict())
    
    return game_session

@router.get("/game-session/{session_id}", response_model=GameSession)
async def get_game_session(session_id: str):
    """Get game session details"""
    session = await game_sessions_collection.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    return GameSession(**session)

@router.put("/game-session/{session_id}/answer")
async def submit_answer(session_id: str, answer_data: GameAnswer):
    """Submit an answer for a question"""
    # Get game session
    session = await game_sessions_collection.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    game_session = GameSession(**session)
    
    if game_session.is_completed:
        raise HTTPException(status_code=400, detail="Game already completed")
    
    if answer_data.question_index != game_session.current_question:
        raise HTTPException(status_code=400, detail="Invalid question index")
    
    # Get the current question
    current_question_id = game_session.questions[game_session.current_question]
    question = await questions_collection.find_one({"id": current_question_id})
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # Check if answer is correct
    is_correct = answer_data.selected_answer == question["correct"]
    
    # Update game session
    game_session.answers.append(answer_data.selected_answer)
    
    if is_correct:
        game_session.score += 1
        game_session.position = min(game_session.position + 10, 100)  # Move 10% forward
    
    # Move to next question
    game_session.current_question += 1
    
    # Check if game is completed
    if game_session.current_question >= len(game_session.questions):
        game_session.is_completed = True
        game_session.is_winner = game_session.position >= 100
        game_session.end_time = datetime.utcnow()
    
    # Update in database
    await game_sessions_collection.update_one(
        {"id": session_id},
        {"$set": game_session.dict()}
    )
    
    return {
        "is_correct": is_correct,
        "correct_answer": question["correct"],
        "current_position": game_session.position,
        "score": game_session.score,
        "is_completed": game_session.is_completed,
        "is_winner": game_session.is_winner
    }

@router.get("/game-session/{session_id}/current-question", response_model=Question)
async def get_current_question(session_id: str):
    """Get the current question for a game session"""
    session = await game_sessions_collection.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    game_session = GameSession(**session)
    
    if game_session.is_completed:
        raise HTTPException(status_code=400, detail="Game already completed")
    
    if game_session.current_question >= len(game_session.questions):
        raise HTTPException(status_code=400, detail="No more questions")
    
    # Get current question
    current_question_id = game_session.questions[game_session.current_question]
    question = await questions_collection.find_one({"id": current_question_id})
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return Question(**question)

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top scores leaderboard"""
    # Get completed game sessions sorted by score (desc) and completion time (asc)
    pipeline = [
        {"$match": {"is_completed": True}},
        {"$lookup": {
            "from": "cars",
            "localField": "selected_car_id",
            "foreignField": "id",
            "as": "car_info"
        }},
        {"$unwind": "$car_info"},
        {"$addFields": {
            "completion_time": {
                "$divide": [
                    {"$subtract": ["$end_time", "$start_time"]},
                    1000  # Convert to seconds
                ]
            }
        }},
        {"$sort": {"score": -1, "completion_time": 1}},
        {"$limit": limit},
        {"$project": {
            "player_name": 1,
            "car_name": "$car_info.name",
            "score": 1,
            "position": 1,
            "is_winner": 1,
            "completion_time": 1,
            "created_at": "$start_time"
        }}
    ]
    
    leaderboard = await game_sessions_collection.aggregate(pipeline).to_list(limit)
    return leaderboard