import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Array of emojis for the cards
const emojis = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
];

// Card component
const MemoryCard = ({ emoji, isFlipped, onClick }) => {
  return (
    <Card
      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isFlipped ? "bg-white" : "bg-blue-500"
      }`}
      onClick={onClick}
    >
      <div className={`text-3xl ${isFlipped ? "" : "invisible"}`}>{emoji}</div>
    </Card>
  );
};

// Main App component
export default function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState({ matches: 0, attempts: 0 });

  // Initialize and shuffle cards
  useEffect(() => {
    const shuffledCards = [...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, []);

  // Handle card click
  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setScore((prevScore) => ({ ...prevScore, attempts: prevScore.attempts + 1 }));

      if (cards[newFlippedIndices[0]] === cards[newFlippedIndices[1]]) {
        setMatchedPairs((prev) => [...prev, ...newFlippedIndices]);
        setScore((prevScore) => ({ ...prevScore, matches: prevScore.matches + 1 }));
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  // Restart game
  const restartGame = () => {
    const shuffledCards = [...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore({ matches: 0, attempts: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Card Game</h1>
      <div className="mb-4">
        <span className="mr-4">Matches: {score.matches}</span>
        <span>Attempts: {score.attempts}</span>
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
      <Button onClick={restartGame} className="mt-4">
        Restart Game
      </Button>
    </div>
  );
}