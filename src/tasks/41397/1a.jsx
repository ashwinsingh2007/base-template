import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emojis = ['😀', '🐶', '🍎', '🚀', '🎨', '🌟', '🍕', '🎸', '🚲'];

const Game = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameLogs, setGameLogs] = useState([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateSequence = () => {
    let newSequence = Array(round + 2).fill().map(() => emojis[Math.floor(Math.random() * emojis.length)]);
    setSequence(newSequence);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      generateSequence();
    }
  }, [isPlaying, round]);

  const startGame = () => {
    setIsPlaying(true);
    setRound(1);
    setScore(0);
    setGameOver(false);
    setTimeLeft(10);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setGameLogs(prevLogs => [...prevLogs, { score, round, time: new Date() }]);
  };

  const handleEmojiClick = (emoji) => {
    if (!isPlaying) return;

    setPlayerSequence(prev => [...prev, emoji]);
    if (emoji !== sequence[playerSequence.length]) {
      endGame();
    } else if (playerSequence.length + 1 === sequence.length) {
      setScore(prevScore => prevScore + 10 + Math.max(0, timeLeft));
      setRound(prevRound => prevRound + 1);
      setPlayerSequence([]);
      setTimeLeft(prevTime => Math.max(5, prevTime - 1));
    }
  };

  const renderSequence = useCallback(() => {
    return sequence.map((emoji, index) => (
      <span key={index} className="text-4xl transition-opacity duration-300 delay-300" style={{ opacity: index * 300 > 900 ? 0 : 1 }}>
        {emoji}
      </span>
    ));
  }, [sequence]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Emoji Match Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div>
              <h2 className="text-2xl mb-4">Game Over!</h2>
              <p>Your Score: {score}</p>
              <Button onClick={startGame}>Restart Game</Button>
            </div>
          ) : isPlaying ? (
            <>
              <div className="text-center mb-4">{renderSequence()}</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {shuffleArray(emojis).map(emoji => 
                  <Button key={emoji} variant="outline" onClick={() => handleEmojiClick(emoji)} className="text-2xl">
                    {emoji}
                  </Button>
                )}
              </div>
              <p>Time Left: {timeLeft}s</p>
              <p>Round: {round}</p>
              <p>Score: {score}</p>
            </>
          ) : (
            <>
              <p>Match the emoji sequence as fast as you can!</p>
              <Button onClick={startGame}>Start Game</Button>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="game" className="w-full max-w-lg mt-4">
        <TabsList>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => setGameLogs([...gameLogs].sort((a, b) => b.score - a.score))}>Sort by Score</Button>
                <Button onClick={() => setGameLogs([...gameLogs].sort((a, b) => new Date(b.time) - new Date(a.time)))} className="ml-2">Sort by Date</Button>
              </div>
              {gameLogs.map((log, index) => (
                <div key={index} className="mb-2">
                  <p>Score: {log.score}, Round: {log.round}, Date: {log.time.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function App() {
  return <Game />;
}