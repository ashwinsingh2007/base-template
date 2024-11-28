import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const emojis = ["😀", "😎", "🥳", "🤔", "😍", "🤯", "🥶", "🤠", "🤡"];

const IntroScreen = ({ onStart }) => (
  <Card className="w-full max-w-md mx-auto mt-10">
    <CardHeader>
      <CardTitle>Emoji Memory Game</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4">
        Match the sequence of emojis displayed on the panel with emojis on the
        3x3 grid. The sequence gets longer each round. Be quick to score more
        points!
      </p>
      <Button onClick={onStart}>Start Game</Button>
    </CardContent>
  </Card>
);

const GameOverScreen = ({ score, onRestart }) => (
  <Card className="w-full max-w-md mx-auto mt-10">
    <CardHeader>
      <CardTitle>Game Over</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-4">Your final score: {score}</p>
      <Button onClick={onRestart}>Restart Game</Button>
    </CardContent>
  </Card>
);

const EmojiGrid = ({ emojis, onEmojiClick, disabled }) => (
  <div className="grid grid-cols-3 gap-2 mt-4">
    {emojis.map((emoji, index) => (
      <Button
        key={index}
        onClick={() => onEmojiClick(emoji)}
        disabled={disabled}
        className="text-3xl h-16 sm:h-20"
      >
        {emoji}
      </Button>
    ))}
  </div>
);

const GameScreen = ({ onGameOver }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [round, setRound] = useState(1);
  const [showingSequence, setShowingSequence] = useState(true);
  const [gridEmojis, setGridEmojis] = useState([]);

  useEffect(() => {
    shuffleGrid();
    generateSequence();
  }, [round]);

  useEffect(() => {
    if (!showingSequence && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onGameOver(score);
    }
  }, [timeLeft, showingSequence]);

  const shuffleGrid = () => {
    setGridEmojis([...emojis].sort(() => Math.random() - 0.5));
  };

  const generateSequence = () => {
    const newSequence = Array.from({ length: round + 2 }, () =>
      emojis[Math.floor(Math.random() * emojis.length)]
    );
    setSequence(newSequence);
    setShowingSequence(true);
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSequence((prev) => [...prev.slice(0, i), seq[i], ...prev.slice(i + 1)]);
    }
    setShowingSequence(false);
    setTimeLeft(Math.max(10 - round, 5));
  };

  const handleEmojiClick = (emoji) => {
    const newPlayerSequence = [...playerSequence, emoji];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length === sequence.length) {
      if (newPlayerSequence.every((e, i) => e === sequence[i])) {
        const timeBonus = Math.floor(timeLeft * 0.5);
        setScore(score + 10 + timeBonus);
        setRound(round + 1);
        setPlayerSequence([]);
      } else {
        onGameOver(score);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Round {round}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl mb-4 h-12 flex justify-center items-center">
          {showingSequence ? sequence.join(" ") : sequence.map(() => "❓").join(" ")}
        </div>
        <div className="mb-4">
          Time left: {timeLeft}s | Score: {score}
        </div>
        <EmojiGrid
          emojis={gridEmojis}
          onEmojiClick={handleEmojiClick}
          disabled={showingSequence}
        />
      </CardContent>
    </Card>
  );
};

const HistoryTable = ({ history, sortKey, sortOrder, onSort }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer" onClick={() => onSort("score")}>
          Score {sortKey === "score" && (sortOrder === "asc" ? "↑" : "↓")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("timeTaken")}>
          Time Taken {sortKey === "timeTaken" && (sortOrder === "asc" ? "↑" : "↓")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("dateTime")}>
          Date & Time {sortKey === "dateTime" && (sortOrder === "asc" ? "↑" : "↓")}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {history.map((game, index) => (
        <TableRow key={index}>
          <TableCell>{game.score}</TableCell>
          <TableCell>{game.timeTaken}s</TableCell>
          <TableCell>{game.dateTime}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function App() {
  const [gameState, setGameState] = useState("intro");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [sortKey, setSortKey] = useState("dateTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterScore, setFilterScore] = useState("");
  const [filterTimeTaken, setFilterTimeTaken] = useState("");
  const [filterDateTime, setFilterDateTime] = useState("");

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    setGameState("gameOver");
    const newGame = {
      score: finalScore,
      timeTaken: Math.floor(Math.random() * 60) + 30, // Simulated time taken
      dateTime: new Date().toLocaleString(),
    };
    setHistory([...history, newGame]);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedHistory = history
    .filter(
      (game) =>
        (filterScore === "" || game.score.toString().includes(filterScore)) &&
        (filterTimeTaken === "" || game.timeTaken.toString().includes(filterTimeTaken)) &&
        (filterDateTime === "" || game.dateTime.includes(filterDateTime))
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="game">
        <TabsList className="mb-4">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          {gameState === "intro" && <IntroScreen onStart={() => setGameState("playing")} />}
          {gameState === "playing" && <GameScreen onGameOver={handleGameOver} />}
          {gameState === "gameOver" && (
            <GameOverScreen
              score={score}
              onRestart={() => setGameState("playing")}
            />
          )}
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Input
                  placeholder="Filter by Score"
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Input
                  placeholder="Filter by Time Taken"
                  value={filterTimeTaken}
                  onChange={(e) => setFilterTimeTaken(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Input
                  placeholder="Filter by Date & Time"
                  value={filterDateTime}
                  onChange={(e) => setFilterDateTime(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
              <HistoryTable
                history={filteredAndSortedHistory}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}