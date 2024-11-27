import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

// List of colors used in the game
const colors = ["Red", "Blue", "Green", "Yellow"];

export default function App() {
  // State to track the current phase of the game: "intro", "playing", or "gameOver"
  const [gameState, setGameState] = useState("intro");
  // State to store the current color to be matched
  const [currentColor, setCurrentColor] = useState("");
  // State to track the player's score
  const [score, setScore] = useState(0);
  // State to track the time left in the current round
  const [timeLeft, setTimeLeft] = useState(2);
  // State to store the list of previous scores
  const [scores, setScores] = useState([]);
  // State to track the current column used for sorting scores
  const [sortColumn, setSortColumn] = useState("date");
  // State to track the sorting order ("asc" or "desc")
  const [sortOrder, setSortOrder] = useState("desc");
  // State to toggle between dark and light modes
  const [darkMode, setDarkMode] = useState(false);

  // Effect to handle the countdown timer when the game is in "playing" state
  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      // Start a timer that decrements the time left every 100ms
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            // Stop the timer when time runs out and end the game
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    // Cleanup the timer when the component unmounts or gameState changes
    return () => clearInterval(timer);
  }, [gameState]);

  // Function to start the game, resetting the score and initiating the first round
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    nextRound();
  };

  // Function to move to the next round by selecting a new random color and resetting the timer
  const nextRound = () => {
    setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
    setTimeLeft(2);
  };

  // Function to handle a player's click on a color button
  const handleColorClick = (color) => {
    if (color === currentColor) {
      // Increase score and proceed to the next round if the color is correct
      setScore((prev) => prev + 10);
      nextRound();
    } else {
      // End the game if the color is incorrect
      endGame();
    }
  };

  // Function to end the game and save the current score with a timestamp
  const endGame = () => {
    setGameState("gameOver");
    setScores((prev) => [
      ...prev,
      { score, date: new Date().toISOString() }, // Save in ISO format for accurate sorting
    ]);
  };

  // Sort the scores based on the selected column and order
  const sortedScores = [...scores].sort((a, b) => {
    if (sortColumn === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
    }
  });

  // Handle clicks on table headers to toggle or set sorting parameters
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Main container */}
      <div className="max-w-md mx-auto">
        {/* Header with title and dark mode toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Color Match Game</h1>
          <div className="flex items-center">
            <span className="mr-2">{darkMode ? "Dark" : "Light"}</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        {/* Tabs to switch between Game and Scores */}
        <Tabs defaultValue="game">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="scores">Scores</TabsTrigger>
          </TabsList>
          <TabsContent value="game">
            {/* Game card */}
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
                    {/* Buttons for colors */}
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
                    {/* Display score and time left */}
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
            {/* Scores card */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  {/* Table header with sortable columns */}
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort("score")} className="cursor-pointer">
                        Score {sortColumn === "score" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                        Date & Time {sortColumn === "date" && (sortOrder === "asc" ? "▲" : "▼")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* Table body with sorted scores */}
                  <TableBody>
                    {sortedScores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.score}</TableCell>
                        <TableCell>{new Date(score.date).toLocaleString()}</TableCell>
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
