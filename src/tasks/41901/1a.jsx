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

const colors = ["Red", "Green", "Blue", "Yellow"];
const difficultyLevels = {
  Easy: 4000,
  Normal: 3000,
  Hard: 2000,
};

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
      onClick={() => onClick(color)}
      disabled={disabled}
    >
      {color}
    </Button>
  );
}

function ScoreTable({ scores, filter, setFilter }) {
  const filteredScores = scores.filter((score) => {
    return (
      (!filter.level || score.level === filter.level) &&
      (!filter.score || score.score >= parseInt(filter.score)) &&
      (!filter.date || new Date(score.date) >= new Date(filter.date))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select onValueChange={(value) => setFilter({ ...filter, level: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
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

export default function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("Normal");
  const [currentColor, setCurrentColor] = useState(null);
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState({});

  const addToSequence = useCallback(() => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, newColor]);
  }, []);

  const playSequence = useCallback(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setCurrentColor(sequence[i]);
        i++;
      } else {
        clearInterval(interval);
        setCurrentColor(null);
        setIsPlaying(true);
      }
    }, 1000);
  }, [sequence]);

  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    addToSequence();
  }, [addToSequence]);

  useEffect(() => {
    if (sequence.length > 0 && !isPlaying && !gameOver) {
      setTimeout(playSequence, 1000);
    }
  }, [sequence, isPlaying, gameOver, playSequence]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (playerSequence.length < sequence.length) {
          endGame();
        }
      }, difficultyLevels[difficulty]);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, playerSequence, sequence, difficulty]);

  const handleColorClick = (color) => {
    if (!isPlaying) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      endGame();
    } else if (newPlayerSequence.length === sequence.length) {
      setScore((prevScore) => prevScore + 1);
      setIsPlaying(false);
      setPlayerSequence([]);
      setTimeout(addToSequence, 1000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    setIsPlaying(false);
    setScores((prevScores) => [
      ...prevScores,
      { score, level: difficulty, date: new Date() },
    ]);
  };

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
                <div className="grid grid-cols-2 gap-4">
                  {colors.map((color) => (
                    <GameButton
                      key={color}
                      color={color}
                      onClick={handleColorClick}
                      disabled={!isPlaying || gameOver}
                    />
                  ))}
                </div>
                <div className="text-center text-2xl font-bold">
                  {currentColor && <div>{currentColor}</div>}
                  {gameOver && <div>Game Over! Your score: {score}</div>}
                  {!gameOver && <div>Score: {score}</div>}
                </div>
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
              <ScoreTable scores={scores} filter={filter} setFilter={setFilter} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}