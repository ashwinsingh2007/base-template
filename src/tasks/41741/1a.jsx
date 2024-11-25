import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// List of emojis to be used in the game
const emojis = ['🐶', '🐱', '🦁', '🐼', '🦊', '🐰', '🐸', '🦄', '🦔', '🐙', '🦑', '🐢'];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const shuffleCards = () => {
    const duplicatedEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(duplicatedEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false
    })));
  };

  useEffect(shuffleCards, []);

  const handleCardClick = (card) => {
    if (isFlipping || card.flipped || card.matched) return;

    if (!firstCard) {
      setFirstCard(card);
      setCards(prevCards => prevCards.map(c => 
        c.id === card.id ? { ...c, flipped: true } : c
      ));
    } else if (!secondCard) {
      setSecondCard(card);
      setCards(prevCards => prevCards.map(c => 
        c.id === card.id ? { ...c, flipped: true } : c
      ));
      setAttempts(attempts + 1);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      setIsFlipping(true);
      if (firstCard.emoji === secondCard.emoji) {
        setCards(prevCards => prevCards.map(c => 
          c.id === firstCard.id || c.id === secondCard.id ? { ...c, matched: true } : c
        ));
        setMatches(matches + 1);
        resetCards();
      } else {
        setTimeout(() => {
          setCards(prevCards => prevCards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id ? { ...c, flipped: false } : c
          ));
          resetCards();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const resetCards = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsFlipping(false);
  };

  const restartGame = () => {
    setMatches(0);
    setAttempts(0);
    shuffleCards();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Emoji Match Game</h1>
        <p>Matches: {matches} | Attempts: {attempts}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {cards.map(card => (
          <Card key={card.id} className="cursor-pointer transform transition-transform hover:scale-105">
            <CardContent className="p-0" onClick={() => handleCardClick(card)}>
              <div className={`card-face h-20 w-20 flex items-center justify-center text-4xl ${card.flipped || card.matched ? 'back-face' : 'front-face'}`}>
                {card.flipped || card.matched ? card.emoji : '❓'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={restartGame} className="mt-4">Restart Game</Button>
    </div>
  );
};

export default function App() {
  return <Game />;
}