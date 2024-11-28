// Importing necessary modules and components
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define available colors and difficulty levels
const colors = ["Red", "Green", "Blue", "Yellow"];
const difficultyLevels = {
  Easy: 4000, // Delay in milliseconds for "Easy"
  Normal: 3000, // Delay for "Normal"
  Hard: 2000, // Delay for "Hard"
};

// Component for rendering individual game buttons
function GameButton({ color, onClick, disabled }) {
  const colorClasses = {
    Red: "bg-red-500 hover:bg-red-600",
    Green: "bg-green-500 hover:bg-green-600",
    Blue: "bg-blue-500 hover:bg-blue-600",
    Yellow: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <Button
      className={`w-full h-24 text-white text-xl font-bold ${colorClasses[color]}`}
      onClick={() => onClick(color)} // Handle button click
      disabled={disabled} // Disable button based on game state
    >
      {color}
    </Button>
  );
}

// Component for displaying and filtering scores
function ScoreTable({ scores, filter, setFilter }) {
  // Filter scores based on selected criteria
  const filteredScores = scores.filter((score) => {
    return (
      (filter.level === "all" || score.level === filter.level) && // Filter by level
      (!filter.score || score.score >= parseInt(filter.score)) && // Filter by minimum score
      (!filter.date || new Date(score.date) >= new Date(filter.date)) // Filter by date
    );
  });

  return (
    <div className="space-y-4">
      {/* Filters for level, score, and date */}
      <div className="flex space-x-4">
        <Select
          onValueChange={(value) => setFilter({ ...filter, level: value })}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {Object.keys(difficultyLevels).map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="number"
          placeholder="Min Score"
          className="border p-2 rounded"
          onChange={(e) => setFilter({ ...filter, score: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>
      {/* Table displaying filtered scores */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date/Time</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredScores.map((score, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(score.date).toLocaleString()}</TableCell>
              <TableCell>{score.level}</TableCell>
              <TableCell>{score.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Main application component
export default function App() {
  // State variables for game and scores
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("Normal");
  const [currentColor, setCurrentColor] = useState(null);
  const [showingSequence, setShowingSequence] = useState(false);
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState({ level: "all" });

  // Add a new random color to the sequence
  const addToSequence = useCallback(() => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, newColor]);
  }, []);

  // Play the sequence to the player
  const playSequence = useCallback(() => {
    setShowingSequence(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setCurrentColor(sequence[i]); // Highlight the current color
        i++;
      } else {
        clearInterval(interval); // End the sequence playback
        setCurrentColor(null);
        setShowingSequence(false);
        setIsPlaying(true); // Allow player interaction
      }
    }, 1000); // Time delay between colors
  }, [sequence]);

  // Start a new game
  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setShowingSequence(true);
    addToSequence(); // Initialize the sequence
  }, [addToSequence]);

  // Trigger sequence playback when a new sequence is added
  useEffect(() => {
    if (sequence.length > 0 && !isPlaying && !gameOver) {
      playSequence();
    }
  }, [sequence, isPlaying, gameOver, playSequence]);

  // Handle player's color button clicks
  const handleColorClick = (color) => {
    if (!isPlaying) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input matches the sequence
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      endGame(); // End game on incorrect input
    } else if (newPlayerSequence.length === sequence.length) {
      setScore((prevScore) => prevScore + 1); // Increase score for correct sequence
      setIsPlaying(false);
      setPlayerSequence([]);
      setTimeout(addToSequence, 1000); // Add a new color after a delay
    }
  };

  // End the game and save the score
  const endGame = () => {
    setGameOver(true);
    setIsPlaying(false);
    setScores((prevScores) => [
      ...prevScores,
      { score, level: difficulty, date: new Date() },
    ]);
  };

  // Render the game interface
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="game" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Color Sequence Memory Game</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Game buttons for each color */}
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((color) => (
                    <GameButton
                      key={color}
                      color={color}
                      onClick={handleColorClick}
                      disabled={!isPlaying || showingSequence || gameOver}
                    />
                  ))}
                </div>
                {/* Display current color or score */}
                <div className="text-center text-2xl font-bold">
                  {currentColor && <div>{currentColor}</div>}
                  {gameOver && <div>Game Over! Your score: {score}</div>}
                  {!gameOver && <div>Score: {score}</div>}
                </div>
                {/* Difficulty selection and start game button */}
                <div className="flex justify-center space-x-4">
                  <Select onValueChange={setDifficulty} defaultValue={difficulty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(difficultyLevels).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={startGame}>
                    {gameOver ? "Play Again" : "Start Game"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle>Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Render score table */}
              <ScoreTable scores={scores} filter={filter} setFilter={setFilter} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
