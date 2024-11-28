import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const colors = ['Red', 'Green', 'Blue', 'Yellow'];
const difficulties = {
  easy: 4000,
  normal: 3000,
  hard: 2000
};

function Game() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showSequence, setShowSequence] = useState(true);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 100), 100);
    } else if (timeLeft === 0) {
      checkSequence();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setTimeLeft(difficulties[currentDifficulty]);
    setIsPlaying(true);
    setGameOver(false);
    generateSequence();
  };

  const generateSequence = () => {
    const newSequence = [...sequence, colors[Math.floor(Math.random() * colors.length)]];
    setSequence(newSequence);
    setShowSequence(true);
    setTimeout(() => setShowSequence(false), 1000);
  };

  const checkSequence = () => {
    if (JSON.stringify(sequence) !== JSON.stringify(playerSequence)) {
      setGameOver(true);
      setIsPlaying(false);
    } else if (sequence.length === playerSequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeLeft(difficulties[currentDifficulty]);
      generateSequence();
    }
  };

  const handleColorClick = (color) => {
    if (!isPlaying || gameOver) return;
    setPlayerSequence([...playerSequence, color]);
    if (playerSequence.length === sequence.length) {
      checkSequence();
    }
  };

  return (
    <Card className="sm:w-96 w-full mx-auto mt-5">
      <CardHeader>
        <CardTitle>Memory Color Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {gameOver ? (
          <>
            <p>Game Over! Your score: {score}</p>
            <Button onClick={startGame}>Play Again</Button>
          </>
        ) : (
          <>
            <Label>Difficulty</Label>
            <Tabs defaultValue="normal" className="w-full">
              <TabsList>
                <TabsTrigger value="easy" onClick={() => setCurrentDifficulty('easy')}>Easy</TabsTrigger>
                <TabsTrigger value="normal" onClick={() => setCurrentDifficulty('normal')}>Normal</TabsTrigger>
                <TabsTrigger value="hard" onClick={() => setCurrentDifficulty('hard')}>Hard</TabsTrigger>
              </TabsList>
            </Tabs>
            <p>Score: {score}</p>
            <p>Time Left: {Math.ceil(timeLeft / 1000)}s</p>
            {showSequence && <p>Watch: {sequence[sequence.length - 1]}</p>}
            <div className="grid grid-cols-2 gap-2">
              {colors.map(color => (
                <Button 
                  key={color} 
                  onClick={() => handleColorClick(color)} 
                  className={`bg-${color.toLowerCase()} text-white`}
                >
                  {color}
                </Button>
              ))}
            </div>
            {!isPlaying && <Button onClick={startGame}>Start Game</Button>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreBoard() {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState({ level: '', score: '', date: '' });

  const addScore = (scoreObj) => {
    setScores(prev => [...prev, { ...scoreObj, date: new Date().toLocaleString() }]);
  };

  useEffect(() => {
    // This would typically fetch scores from somewhere, but here we simulate it
    setScores([]);
  }, []);

  const filteredScores = scores.filter(score => 
    (!filter.level || score.level === filter.level) &&
    (!filter.score || score.score >= parseInt(filter.score, 10)) &&
    (!filter.date || new Date(score.date).toDateString().includes(filter.date))
  );

  return (
    <Card className="sm:w-96 w-full mx-auto mt-5">
      <CardHeader>
        <CardTitle>Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label>Filter</Label>
          <Input 
            placeholder="Level" 
            value={filter.level} 
            onChange={(e) => setFilter({...filter, level: e.target.value})}
          />
          <Input 
            placeholder="Min Score" 
            type="number"
            value={filter.score} 
            onChange={(e) => setFilter({...filter, score: e.target.value})}
          />
          <Input 
            placeholder="Date" 
            value={filter.date} 
            onChange={(e) => setFilter({...filter, date: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          {filteredScores.map((score, idx) => (
            <div key={idx} className="border-b pb-2">
              <p>Score: {score.score}</p>
              <p>Level: {score.level}</p>
              <p>Date: {score.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="p-4 bg-background min-h-screen">
      <Tabs defaultValue="game" className="w-full">
        <TabsList>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <Game />
        </TabsContent>
        <TabsContent value="scores">
          <ScoreBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}