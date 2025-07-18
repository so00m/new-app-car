import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-4">
      <div className="relative">
        {/* Floating animation elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
        
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/90 shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center space-x-4 text-6xl mb-4">
              <span className="animate-bounce">🏎️</span>
              <span className="animate-bounce animation-delay-150">🏁</span>
              <span className="animate-bounce animation-delay-300">🚗</span>
            </div>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Car Racing Quiz
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              Test your car knowledge and race to the finish line!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-100 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">How to Play:</h3>
              <div className="space-y-2 text-gray-600">
                <p>🚗 Choose your racing car</p>
                <p>❓ Answer car-related questions</p>
                <p>🏃‍♂️ Move forward for each correct answer</p>
                <p>🏆 First to reach the finish line wins!</p>
              </div>
            </div>
            <Button 
              onClick={onStart}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🏁 Start Racing! 🏁
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeScreen;