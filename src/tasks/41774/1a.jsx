import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';

function Game() {
  const choices = ['Rock', 'Paper', 'Scissors'];
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [ties, setTies] = useState(0);
  const [history, setHistory] = useState(Array(10).fill().map((_, i) => ({
    id: i,
    userChoice: choices[Math.floor(Math.random() * 3)],
    computerChoice: choices[Math.floor(Math.random() * 3)],
    result: Math.random() > 0.5 ? 'User' : (Math.random() < 0.5 ? 'Computer' : 'Tie'),
    date: new Date(Date.now() - Math.random() * 100000000),
  })));
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ winner: '', result: '', dateRange: '24' });
  
  const playGame = (choice) => {
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
      setUserScore(userScore + 1);
    } else if (choice === compChoice) {
      gameResult = "It's a Tie!";
      setTies(ties + 1);
    } else {
      gameResult = 'Computer Wins!';
      setComputerScore(computerScore + 1);
    }
    setResult(gameResult);
    
    setHistory(prev => [...prev, {
      id: prev.length,
      userChoice: choice,
      computerChoice: compChoice,
      result: gameResult.includes('Win') ? 'User' : (gameResult.includes('Tie') ? 'Tie' : 'Computer'),
      date: new Date(),
    }]);
  };

  const filteredHistory = history
    .filter(h => filter.winner === '' || h.result === filter.winner)
    .filter(h => filter.result === '' || (h.result === 'Tie' ? 'Tie' : 'Win/Loss') === filter.result)
    .filter(h => {
      const hours = parseInt(filter.dateRange);
      return new Date() - h.date < hours * 60 * 60 * 1000;
    });

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Rock, Paper, Scissors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {choices.map(choice => 
              <Button key={choice} onClick={() => playGame(choice)}>{choice}</Button>
            )}
            {userChoice && computerChoice && 
              <div>
                <p>You chose: {userChoice}</p>
                <p>Computer chose: {computerChoice}</p>
                <p>{result}</p>
              </div>
            }
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Card>
            <CardContent>
              <p>User Wins: {userScore}</p>
              <p>Computer Wins: {computerScore}</p>
              <p>Ties: {ties}</p>
              <p>Win Percentage: {((userScore / (userScore + computerScore + ties)) * 100 || 0).toFixed(2)}%</p>
              <p>Most Frequent User Choice: {userScore > computerScore && userScore > ties ? 'Rock' : 'Paper'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <div className="flex justify-between items-center mb-4">
            <Input 
              placeholder="Filter by winner" 
              value={filter.winner} 
              onChange={e => setFilter({...filter, winner: e.target.value})} 
            />
            <select 
              onChange={e => setFilter({...filter, result: e.target.value})}
              value={filter.result}
              className="p-2 border rounded"
            >
              <option value="">All Results</option>
              <option value="Win/Loss">Win/Loss</option>
              <option value="Tie">Tie</option>
            </select>
            <select 
              onChange={e => setFilter({...filter, dateRange: e.target.value})}
              value={filter.dateRange}
              className="p-2 border rounded"
            >
              <option value="1">Last 1 hour</option>
              <option value="2">Last 2 hours</option>
              <option value="12">Last 12 hours</option>
              <option value="24">Last 24 hours</option>
            </select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Computer</TableHead>
                <TableHead>Winner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{format(game.date, 'MM/dd/yyyy HH:mm')}</TableCell>
                  <TableCell>{game.userChoice}</TableCell>
                  <TableCell>{game.computerChoice}</TableCell>
                  <TableCell>{game.result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
            <Button onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'dark' : ''} bg-background min-h-screen`}>
      <div className="flex justify-end p-4">
        <Checkbox checked={isDark} onCheckedChange={setIsDark} id="theme-switch" />
        <label htmlFor="theme-switch" className="ml-2">Dark Mode</label>
      </div>
      <Game />
    </div>
  );
}