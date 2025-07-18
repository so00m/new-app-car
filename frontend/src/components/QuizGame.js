import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuizGame = ({ selectedCar, onRestart }) => {
  const [gameSession, setGameSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  const startGame = async () => {
    try {
      if (!playerName.trim()) {
        setError('Please enter your name to start the game!');
        return;
      }

      setLoading(true);
      
      // Create game session
      const sessionResponse = await axios.post(`${API}/game-session`, {
        player_name: playerName.trim(),
        selected_car_id: selectedCar.id
      });
      
      const session = sessionResponse.data;
      setGameSession(session);
      
      // Get questions for this session
      const questionsResponse = await axios.get(`${API}/questions?limit=10`);
      setQuestions(questionsResponse.data);
      
      // Get first question
      if (questionsResponse.data.length > 0) {
        setCurrentQuestion(questionsResponse.data[0]);
        setCurrentQuestionIndex(0);
      }
      
      setShowNameInput(false);
      setError(null);
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = async (answerIndex) => {
    if (selectedAnswer !== null || !gameSession) return;
    
    try {
      setSelectedAnswer(answerIndex);
      
      // Submit answer to backend
      const response = await axios.put(`${API}/game-session/${gameSession.id}/answer`, {
        question_index: currentQuestionIndex,
        selected_answer: answerIndex
      });
      
      const result = response.data;
      setIsCorrect(result.is_correct);
      setShowResult(true);
      
      // Update game session with new data
      setGameSession(prev => ({
        ...prev,
        score: result.score,
        position: result.current_position,
        is_completed: result.is_completed,
        is_winner: result.is_winner
      }));
      
      setTimeout(() => {
        if (!result.is_completed && currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentQuestion(questions[currentQuestionIndex + 1]);
          setSelectedAnswer(null);
          setShowResult(false);
          setIsCorrect(null);
        } else {
          // Game completed
          setGameSession(prev => ({
            ...prev,
            is_completed: true,
            is_winner: result.is_winner
          }));
        }
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    }
  };

  const resetGame = () => {
    setGameSession(null);
    setCurrentQuestion(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setShowNameInput(true);
    setPlayerName('');
    setError(null);
  };

  // Show name input
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">{selectedCar.emoji}</div>
            <CardTitle className="text-2xl font-bold" style={{ color: selectedCar.color }}>
              Ready to race with {selectedCar.name}?
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your name to start the quiz!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            <Button 
              onClick={startGame}
              disabled={loading}
              className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {loading ? 'Starting Game...' : '🏁 Start Racing!'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game... 🏎️</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error}</div>
          <Button onClick={resetGame} className="bg-white text-red-600 hover:bg-gray-100">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!gameSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Preparing quiz... 🧠</div>
      </div>
    );
  }

  const progressPercentage = gameSession.position;
  const isGameCompleted = gameSession.is_completed;
  const isWinner = gameSession.is_winner;

  if (isGameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="text-8xl mb-4">
              {isWinner ? "🏆" : "🏁"}
            </div>
            <CardTitle className="text-4xl font-bold">
              {isWinner ? "🎉 You Won! 🎉" : "Race Complete!"}
            </CardTitle>
            <CardDescription className="text-xl">
              {isWinner ? "Congratulations! You reached the finish line!" : "Good effort! Try again to win!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-100 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold">Final Results for {gameSession.player_name}:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-600">{gameSession.score}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{gameSession.position}%</p>
                  <p className="text-sm text-gray-600">Distance Covered</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={resetGame}
                className="flex-1 h-12 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                🔄 Play Again
              </Button>
              <Button 
                onClick={onRestart}
                variant="outline"
                className="flex-1 h-12 text-lg"
              >
                🏠 Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header with car info and progress */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedCar.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: selectedCar.color }}>
                  {selectedCar.name}
                </h2>
                <p className="text-gray-600">Driver: {gameSession.player_name}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Score: {gameSession.score}/{questions.length}
              </Badge>
            </div>
          </div>
          
          {/* Race Track */}
          <div className="bg-gray-800 rounded-lg p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">🏁 Start</span>
              <span className="text-white font-semibold">Finish 🏆</span>
            </div>
            <div className="relative h-12 bg-gray-700 rounded-lg border-2 border-white">
              {/* Track markings */}
              <div className="absolute inset-0 flex items-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 h-full border-r border-gray-600 border-dashed"></div>
                ))}
              </div>
              {/* Car position */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-1000 ease-out"
                style={{ 
                  left: `${Math.max(progressPercentage - 2, 0)}%`,
                  color: selectedCar.color 
                }}
              >
                {selectedCar.emoji}
              </div>
            </div>
            <div className="mt-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-center text-white/80 text-sm mt-1">
                {gameSession.position}% to finish line
              </p>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <div className="text-2xl">🧠</div>
            </div>
            <CardTitle className="text-2xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "h-16 text-lg font-semibold transition-all duration-200";
                
                if (showResult) {
                  if (index === currentQuestion.correct) {
                    buttonClass += " bg-green-500 hover:bg-green-600 text-white";
                  } else if (index === selectedAnswer) {
                    buttonClass += " bg-red-500 hover:bg-red-600 text-white";
                  } else {
                    buttonClass += " bg-gray-300 text-gray-500 cursor-not-allowed";
                  }
                } else {
                  buttonClass += " hover:bg-blue-500 hover:text-white transform hover:scale-105";
                }
                
                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className={buttonClass}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
            
            {showResult && (
              <div className="mt-6 text-center">
                <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Correct! Your car moves forward!' : '❌ Wrong answer! Better luck next time!'}
                </div>
                <div className="text-gray-600 mt-2">
                  {isCorrect ? 'Great job! 🎉' : `The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGame;