from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Car(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    color: str
    emoji: str
    description: str
    image: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CarCreate(BaseModel):
    name: str
    color: str
    emoji: str
    description: str
    image: str

class Question(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    options: List[str]
    correct: int
    difficulty: str = "medium"  # easy, medium, hard
    category: str = "general"  # general, brands, history, speed, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestionCreate(BaseModel):
    question: str
    options: List[str]
    correct: int
    difficulty: str = "medium"
    category: str = "general"

class GameSession(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    selected_car_id: str
    questions: List[str]  # List of question IDs
    current_question: int = 0
    score: int = 0
    position: int = 0  # Position on race track (0-100)
    answers: List[int] = []  # List of selected answers
    is_completed: bool = False
    is_winner: bool = False
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None

class GameSessionCreate(BaseModel):
    player_name: str
    selected_car_id: str

class GameAnswer(BaseModel):
    question_index: int
    selected_answer: int

class LeaderboardEntry(BaseModel):
    player_name: str
    car_name: str
    score: int
    position: int
    is_winner: bool
    completion_time: float  # Time taken in seconds
    created_at: datetime