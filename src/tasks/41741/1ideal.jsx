import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Array of emojis for card faces
const emojis = ["😀", "😎", "🥳", "🤔", "🤯", "😴", "🥰", "🤠", "🤡", "🤖", "👽", "👻", "🐶", "🐱", "🐼", "🦄", "🍕", "🍔"];

// Shuffle array function
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Card component
const MemoryCard = ({ emoji, isFlipped, onClick }) => {
  return (
    <Card
      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isFlipped ? "bg-white" : "bg-blue-500"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 text-3xl sm:text-4xl">
        {isFlipped ? emoji : "?"}
      </CardContent>
    </Card>
  );
};

// Main App component
export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [attempts, setAttempts] = useState({ 1: 0, 2: 0 });
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledEmojis = shuffleArray([...emojis, ...emojis]);
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setAttempts({ 1: 0, 2: 0 });
    setGameOver(false);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setAttempts((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));

      if (cards[newFlippedIndices[0]] === cards[newFlippedIndices[1]]) {
        setMatchedPairs((prev) => [...prev, ...newFlippedIndices]);
        setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }, 1000);
      }
    }

    if (matchedPairs.length === cards.length - 2) {
      setGameOver(true);
    }
  };

  const calculateWinner = () => {
    const player1Score = scores[1] / attempts[1];
    const player2Score = scores[2] / attempts[2];
    return player1Score > player2Score ? 1 : 2;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Match Game</h1>
      <div className="mb-4 text-lg">
        <span className={`mr-4 ${currentPlayer === 1 ? "font-bold" : ""}`}>
          Player 1: {scores[1]} matches ({attempts[1]} attempts)
        </span>
        <span className={currentPlayer === 2 ? "font-bold" : ""}>
          Player 2: {scores[2]} matches ({attempts[2]} attempts)
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
        {cards.map((emoji, index) => (
          <MemoryCard
            key={index}
            emoji={emoji}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <Button onClick={initializeGame} className="mt-4">
        Restart Game
      </Button>
      {gameOver && (
        <div className="mt-4 text-xl font-bold">
          Game Over! Player {calculateWinner()} wins!
        </div>
      )}
    </div>
  );
}