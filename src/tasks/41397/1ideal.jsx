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
import { format, parseISO, isSameDay } from "date-fns";

// Array of emojis used in the game
const emojis = ["😀", "😎", "🥳", "🤔", "😍", "🤯", "🥶", "🤠", "🤡"];

// Component for the introduction screen
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

// Component for the game over screen
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

// Grid of emojis that players interact with
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

// Main game logic
const GameScreen = ({ onGameOver, setGameStartTime }) => {
  const [sequence, setSequence] = useState([]); // The emoji sequence to memorize
  const [playerSequence, setPlayerSequence] = useState([]); // Player's current sequence
  const [score, setScore] = useState(0); // Player's score
  const [timeLeft, setTimeLeft] = useState(10); // Time left in the current round
  const [round, setRound] = useState(1); // Current round number
  const [showingSequence, setShowingSequence] = useState(true); // Whether the sequence is currently being shown
  const [gridEmojis, setGridEmojis] = useState([]); // Emojis displayed on the grid

  // Start a new round and generate a new sequence
  useEffect(() => {
    setGameStartTime(new Date()); // Record start time
    shuffleGrid(); // Shuffle the emoji grid
    generateSequence(); // Generate a new sequence
  }, [round]);

  // Countdown timer for the current round
  useEffect(() => {
    if (!showingSequence && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onGameOver(score); // End the game if time runs out
    }
  }, [timeLeft, showingSequence]);

  // Shuffle emojis for the grid
  const shuffleGrid = () => {
    setGridEmojis([...emojis].sort(() => Math.random() - 0.5));
  };

  // Generate a new sequence based on the round number
  const generateSequence = () => {
    const newSequence = Array.from({ length: round + 2 }, () =>
      emojis[Math.floor(Math.random() * emojis.length)]
    );
    setSequence(newSequence);
    setShowingSequence(true);
    showSequence(newSequence); // Display the sequence
  };

  // Show the sequence one emoji at a time
  const showSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSequence((prev) => [...prev.slice(0, i), seq[i], ...prev.slice(i + 1)]);
    }
    setShowingSequence(false);
    setTimeLeft(Math.max(10 - round, 5)); // Adjust time limit based on the round
  };

  // Handle player's emoji click
  const handleEmojiClick = (emoji) => {
    const newPlayerSequence = [...playerSequence, emoji];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's sequence matches the game's sequence
    if (newPlayerSequence.length === sequence.length) {
      if (newPlayerSequence.every((e, i) => e === sequence[i])) {
        const timeBonus = Math.floor(timeLeft * 0.5); // Bonus for leftover time
        setScore(score + 10 + timeBonus); // Update score
        setRound(round + 1); // Move to the next round
        setPlayerSequence([]); // Reset player's sequence
      } else {
        onGameOver(score); // End the game if the sequence is incorrect
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
          disabled={showingSequence} // Disable grid when showing sequence
        />
      </CardContent>
    </Card>
  );
};

// Table to display game history
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
          <TableCell>{format(parseISO(game.dateTime), "PPpp")}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

// Main app component
export default function App() {
  // State management for the game
  const [gameState, setGameState] = useState("intro");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]); // Game history
  const [sortKey, setSortKey] = useState("dateTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterScore, setFilterScore] = useState(""); // Filter by score
  const [filterTimeTaken, setFilterTimeTaken] = useState(""); // Filter by time
  const [filterDate, setFilterDate] = useState(null); // Filter by date
  const [gameStartTime, setGameStartTime] = useState(null); // Game start time

  // Handle game over
  const handleGameOver = (finalScore) => {
    const gameEndTime = new Date();
    const timeTaken = Math.floor((gameEndTime - gameStartTime) / 1000); // Accurate time taken
    const newGame = {
      score: finalScore,
      timeTaken,
      dateTime: gameEndTime.toISOString(),
    };
    setHistory([...history, newGame]); // Add game to history
    setScore(finalScore); // Set final score
    setGameState("gameOver"); // Show game over screen
  };

  // Handle sorting in history table
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter and sort game history
  const filteredAndSortedHistory = history
    .filter(
      (game) =>
        (filterScore === "" || game.score.toString().includes(filterScore)) &&
        (filterTimeTaken === "" || game.timeTaken.toString().includes(filterTimeTaken)) &&
        (!filterDate || isSameDay(parseISO(game.dateTime), filterDate))
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
          {gameState === "playing" && <GameScreen onGameOver={handleGameOver} setGameStartTime={setGameStartTime} />}
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
                  type="date"
                  value={filterDate ? format(filterDate, "yyyy-MM-dd") : ""}
                  onChange={(e) =>
                    setFilterDate(e.target.value ? new Date(e.target.value) : null)
                  }
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
