import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const choices = ['Rock', 'Paper', 'Scissors'];

const generateDummyHistory = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    date: new Date(Date.now() - i * 1000 * 60 * 60),
    userChoice: choices[Math.floor(Math.random() * 3)],
    computerChoice: choices[Math.floor(Math.random() * 3)],
    result: Math.random() > 0.5 ? 'User' : 'Computer'
  }));
};

const App = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState(generateDummyHistory());
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState('light');
  const [filters, setFilters] = useState({ winner: '', result: '', time: '' });

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const play = (choice) => {
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(compChoice);
    let gameResult = '';
    if (
      (choice === 'Rock' && compChoice === 'Scissors') ||
      (choice === 'Paper' && compChoice === 'Rock') ||
      (choice === 'Scissors' && compChoice === 'Paper')
    ) {
      gameResult = 'You Win!';
    } else if (choice === compChoice) {
      gameResult = 'It’s a Tie!';
    } else {
      gameResult = 'Computer Wins!';
    }
    setResult(gameResult);
    setHistory(prev => [...prev, {
      id: prev.length,
      date: new Date(),
      userChoice: choice,
      computerChoice: compChoice,
      result: gameResult.includes('You') ? 'User' : (gameResult.includes('Computer') ? 'Computer' : 'Tie')
    }]);
  };

  const stats = history.reduce((acc, game) => {
    acc[game.result === 'User' ? 'userWins' : (game.result === 'Computer' ? 'computerWins' : 'ties')]++;
    return acc;
  }, { userWins: 0, computerWins: 0, ties: 0 });

  const filteredHistory = history.filter(game => 
    (!filters.winner || game.result === filters.winner) &&
    (!filters.result || (filters.result === 'Win' && game.result === 'User') || (filters.result === 'Loss' && game.result === 'Computer') || (filters.result === 'Tie' && game.result === 'Tie')) &&
    (!filters.time || (() => {
      const now = new Date();
      const hours = parseInt(filters.time.split(' ')[1]);
      return now - game.date <= hours * 60 * 60 * 1000;
    })())
  );

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <button onClick={toggleTheme} className="fixed top-4 right-4 z-10">Toggle Theme</button>
      <Tabs defaultValue="game" className="w-full max-w-lg mx-auto p-4">
        <TabsList>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Rock Paper Scissors</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="flex space-x-4">
                {choices.map(choice => 
                  <Button key={choice} onClick={() => play(choice)}>{choice}</Button>
                )}
              </div>
              {userChoice && <p>You chose: {userChoice}</p>}
              {computerChoice && <p>Computer chose: {computerChoice}</p>}
              {result && <p>{result}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Filter by Winner</Label>
                <Input type="text" onChange={(e) => setFilters({...filters, winner: e.target.value})} placeholder="User/Computer" />
                <Label>Filter by Result</Label>
                <Input type="text" onChange={(e) => setFilters({...filters, result: e.target.value})} placeholder="Win/Loss/Tie" />
                <Label>Filter by Time</Label>
                <Input type="text" onChange={(e) => setFilters({...filters, time: e.target.value})} placeholder="Last X hours" />
              </div>
              {paginatedHistory.map(game => (
                <div key={game.id} className="border-b py-2">
                  <p>{game.date.toLocaleString()}</p>
                  <p>{game.userChoice} vs {game.computerChoice}</p>
                  <p>Winner: {game.result}</p>
                </div>
              ))}
              <div className="mt-4 flex justify-between">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</Button>
                <Button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage * 5 >= filteredHistory.length}>Next</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User Wins: {stats.userWins}</p>
              <p>Computer Wins: {stats.computerWins}</p>
              <p>Ties: {stats.ties}</p>
              {/* Note: For simplicity, average duration and win percentage are not calculated here */}
              <p>Most Frequent User Choice: {/* Logic for most frequent choice would go here */}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;