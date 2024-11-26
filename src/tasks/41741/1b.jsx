import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function CardGame() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [turn, setTurn] = useState(1);
  const [player1, setPlayer1] = useState({ matches: 0, attempts: 0 });
  const [player2, setPlayer2] = useState({ matches: 0, attempts: 0 });
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = useCallback(() => {
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffledEmojis = shuffleArray(duplicatedEmojis);
    setCards(shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false,
    })));
    setFirstCard(null);
    setSecondCard(null);
    setPlayer1({ matches: 0, attempts: 0 });
    setPlayer2({ matches: 0, attempts: 0 });
    setTurn(1);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (card) => {
    if (card.flipped || card.matched || (firstCard && secondCard)) return;

    if (!firstCard) {
      setFirstCard(card);
      setCards(cards.map(c => c.id === card.id ? { ...c, flipped: true } : c));
    } else if (firstCard.id !== card.id) {
      setSecondCard(card);
      setCards(cards.map(c => c.id === card.id ? { ...c, flipped: true } : c));
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      const currentPlayer = turn === 1 ? player1 : player2;
      const updatePlayer = turn === 1 ? setPlayer1 : setPlayer2;
      
      if (firstCard.emoji === secondCard.emoji) {
        updatePlayer({ ...currentPlayer, matches: currentPlayer.matches + 1 });
        setCards(cards => cards.map(c => 
          c.id === firstCard.id || c.id === secondCard.id ? { ...c, matched: true } : c
        ));
        setTurn(turn === 1 ? 2 : 1);
      } else {
        updatePlayer({ ...currentPlayer, attempts: currentPlayer.attempts + 1 });
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id ? { ...c, flipped: false } : c
          ));
          setTurn(turn === 1 ? 2 : 1);
          setFirstCard(null);
          setSecondCard(null);
        }, 1000);
      }
    }
  }, [firstCard, secondCard, turn, player1, player2]);

  useEffect(() => {
    if (cards.every(card => card.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  const efficiency = (player) => {
    return player.matches / (player.attempts + player.matches) || 0;
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Match Game</CardTitle>
        </CardHeader>
        <CardContent>
          {gameOver ? (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Game Over!</h2>
              <p>Player 1 Efficiency: {efficiency(player1).toFixed(2)}</p>
              <p>Player 2 Efficiency: {efficiency(player2).toFixed(2)}</p>
              <p>{efficiency(player1) > efficiency(player2) ? 'Player 1 wins!' : 'Player 2 wins!'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {cards.map(card => (
                  <div 
                    key={card.id} 
                    onClick={() => handleCardClick(card)}
                    className={`card-container aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:scale-105 transition-all cursor-pointer ${card.flipped || card.matched ? 'flip' : ''}`}
                  >
                    <div className={`card-inner ${card.flipped || card.matched ? 'flipped' : ''}`}>
                      <div className="card-back w-full h-full flex items-center justify-center text-4xl">?</div>
                      <div className="card-front w-full h-full flex items-center justify-center text-4xl">{card.emoji}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p>Player {turn}'s Turn</p>
              <p>Player 1: Matches {player1.matches}, Attempts {player1.attempts}</p>
              <p>Player 2: Matches {player2.matches}, Attempts {player2.attempts}</p>
            </>
          )}
        </CardContent>
        <Button onClick={initializeGame} className="mt-4">Restart Game</Button>
      </Card>
    </div>
  );
}

export default function App() {
  return <CardGame />;
}