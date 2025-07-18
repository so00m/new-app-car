import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { questions, raceTrackLength, moveDistance } from '../mock';

const QuizGame = ({ selectedCar, onRestart }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
      setPosition(prev => Math.min(prev + moveDistance, raceTrackLength));
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(null);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setPosition(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
  };

  const progressPercentage = (position / raceTrackLength) * 100;
  const isWinner = position >= raceTrackLength;

  if (gameOver) {
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
              <h3 className="text-lg font-semibold">Final Results:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{position}%</p>
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
                <p className="text-gray-600">Racing to victory!</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Score: {score}/{questions.length}
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
                {position}% to finish line
              </p>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-lg">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <div className="text-2xl">🧠</div>
            </div>
            <CardTitle className="text-2xl leading-relaxed">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => {
                let buttonClass = "h-16 text-lg font-semibold transition-all duration-200";
                
                if (showResult) {
                  if (index === questions[currentQuestion].correct) {
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
                  {isCorrect ? 'Great job! 🎉' : `The correct answer was: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`}
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