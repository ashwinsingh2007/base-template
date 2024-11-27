import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const colors = ['red', 'blue', 'green', 'yellow'];
const colorNames = ['Red', 'Blue', 'Green', 'Yellow'];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
    setTimeLeft(2);
    newRound();
  };

  const newRound = () => {
    setCurrentColor(getRandomColor());
  };

  const handleColorClick = (color) => {
    if (color === currentColor) {
      setScore(score + 10);
      newRound();
      setTimeLeft(2);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    setHistory(prev => [...prev, { score, date: new Date() }]);
  };

  const restartGame = () => {
    startGame();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const sortedHistory = [...history].sort((a, b) => 
    b.date - a.date || b.score - a.score
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} p-4 transition-colors duration-500`}>
      <div className="flex justify-end mb-4">
        <Switch onCheckedChange={toggleDarkMode} checked={isDarkMode} />
      </div>
      <Tabs defaultValue="game" className="w-full max-w-lg mx-auto">
        <TabsList>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>{gameOver ? "Game Over" : "Color Match Game"}</CardTitle>
            </CardHeader>
            <CardContent>
              {!gameStarted ? (
                <div className="text-center">
                  <p>Match the color name with the correct color button!</p>
                  <Button onClick={startGame}>Start Game</Button>
                </div>
              ) : (
                <>
                  <div className="text-4xl text-center mb-4">{colorNames[colors.indexOf(currentColor)]}</div>
                  <div className="grid grid-cols-2 gap-4">
                    {colors.map(color => (
                      <Button 
                        key={color} 
                        className={`h-12 ${color}-500 hover:${color}-600`} 
                        onClick={() => handleColorClick(color)}>
                          {color}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    Time Left: {timeLeft}s | Score: {score}
                  </div>
                </>
              )}
              {gameOver && <Button onClick={restartGame}>Restart Game</Button>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">S.No</th>
                    <th className="text-left">Score</th>
                    <th className="text-left">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.score}</td>
                      <td>{entry.date.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;