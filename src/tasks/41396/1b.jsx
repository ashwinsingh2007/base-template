import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const colors = ["Red", "Blue", "Green", "Yellow"];

export default function App() {
  const [gameState, setGameState] = useState("intro");
  const [currentColor, setCurrentColor] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [scores, setScores] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    nextRound();
  };

  const nextRound = () => {
    setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
    setTimeLeft(2);
  };

  const handleColorClick = (color) => {
    if (color === currentColor) {
      setScore((prev) => prev + 10);
      nextRound();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("gameOver");
    setScores((prev) => [
      ...prev,
      { score, date: new Date().toLocaleString() },
    ]);
  };

  const sortedScores = [...scores].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return b.score - a.score;
    }
  });

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Color Match Game</h1>
          <div className="flex items-center">
            <span className="mr-2">{darkMode ? "Dark" : "Light"}</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        <Tabs defaultValue="game">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="scores">Scores</TabsTrigger>
          </TabsList>
          <TabsContent value="game">
            <Card>
              <CardHeader>
                <CardTitle>
                  {gameState === "intro" && "Welcome to Color Match!"}
                  {gameState === "playing" && currentColor}
                  {gameState === "gameOver" && "Game Over!"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameState === "intro" && (
                  <p className="mb-4">
                    Click the button that matches the color name within 2 seconds. Score 10 points for each correct match!
                  </p>
                )}
                {gameState === "playing" && (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {colors.map((color) => (
                        <Button
                          key={color}
                          className="h-[50px] w-full"
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => handleColorClick(color)}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <span>Score: {score}</span>
                      <span>Time: {timeLeft.toFixed(1)}s</span>
                    </div>
                  </div>
                )}
                {gameState === "gameOver" && (
                  <p className="mb-4">Your final score: {score}</p>
                )}
                {(gameState === "intro" || gameState === "gameOver") && (
                  <Button onClick={startGame} className="w-full">
                    {gameState === "intro" ? "Start Game" : "Restart Game"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle>Previous Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-2">
                  <Button onClick={() => setSortBy(sortBy === "date" ? "score" : "date")}>
                    Sort by {sortBy === "date" ? "Score" : "Date"}
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.No</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedScores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{score.score}</TableCell>
                        <TableCell>{score.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}