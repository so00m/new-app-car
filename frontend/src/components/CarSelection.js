import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cars } from '../mock';

const CarSelection = ({ onSelectCar }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Racing Car</h1>
          <p className="text-xl text-white/80">Select the car that will take you to victory!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Card 
              key={car.id} 
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-sm border-0"
              onClick={() => onSelectCar(car)}
            >
              <CardHeader className="text-center">
                <div className="text-6xl mb-4 group-hover:animate-bounce">
                  {car.emoji}
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: car.color }}>
                  {car.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {car.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="w-full h-32 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-inner"
                  style={{ 
                    background: `linear-gradient(135deg, ${car.color}, ${car.color}dd)`,
                    boxShadow: `inset 0 2px 10px ${car.color}66`
                  }}
                >
                  {car.emoji}
                </div>
                <Button 
                  className="w-full h-12 text-lg font-semibold group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-200"
                  style={{ 
                    backgroundColor: car.color,
                    borderColor: car.color 
                  }}
                >
                  Select {car.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-white/70 text-sm">
            💡 Tip: Each car has the same speed - choose based on your favorite style!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarSelection;