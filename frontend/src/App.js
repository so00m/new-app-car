import React, { useState } from 'react';
import "./App.css";
import WelcomeScreen from './components/WelcomeScreen';
import CarSelection from './components/CarSelection';
import QuizGame from './components/QuizGame';

function App() {
  const [gameState, setGameState] = useState('welcome'); // welcome, carSelection, game
  const [selectedCar, setSelectedCar] = useState(null);

  const handleStart = () => {
    setGameState('carSelection');
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setGameState('game');
  };

  const handleRestart = () => {
    setGameState('welcome');
    setSelectedCar(null);
  };

  return (
    <div className="App">
      {gameState === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {gameState === 'carSelection' && (
        <CarSelection onSelectCar={handleSelectCar} />
      )}
      {gameState === 'game' && selectedCar && (
        <QuizGame selectedCar={selectedCar} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;