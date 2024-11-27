import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const choices = ["Rock", "Paper", "Scissors"];
const initialDummyData = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  userChoice: choices[Math.floor(Math.random() * 3)],
  computerChoice: choices[Math.floor(Math.random() * 3)],
  result: ["You Win!", "Computer Wins!", "It's a Tie!"][Math.floor(Math.random() * 3)],
  date: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
}));

function getWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) return "It's a Tie!";
  if (
    (userChoice === "Rock" && computerChoice === "Scissors") ||
    (userChoice === "Paper" && computerChoice === "Rock") ||
    (userChoice === "Scissors" && computerChoice === "Paper")
  ) {
    return "You Win!";
  }
  return "Computer Wins!";
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(initialDummyData);
  const [stats, setStats] = useState({
    userWins: 0,
    computerWins: 0,
    ties: 0,
    totalRounds: 0,
    averageDuration: 0,
    userChoices: { Rock: 0, Paper: 0, Scissors: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [winnerFilter, setWinnerFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const playGame = (choice) => {
    const startTime = Date.now();
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const result = getWinner(choice, computerChoice);
    const endTime = Date.now();
    const duration = endTime - startTime;

    setUserChoice(choice);
    setComputerChoice(computerChoice);
    setResult(result);

    const newHistory = [
      { id: history.length, userChoice: choice, computerChoice, result, date: new Date().toISOString() },
      ...history,
    ];
    setHistory(newHistory);

    setStats((prevStats) => ({
      userWins: prevStats.userWins + (result === "You Win!" ? 1 : 0),
      computerWins: prevStats.computerWins + (result === "Computer Wins!" ? 1 : 0),
      ties: prevStats.ties + (result === "It's a Tie!" ? 1 : 0),
      totalRounds: prevStats.totalRounds + 1,
      averageDuration: (prevStats.averageDuration * prevStats.totalRounds + duration) / (prevStats.totalRounds + 1),
      userChoices: { ...prevStats.userChoices, [choice]: prevStats.userChoices[choice] + 1 },
    }));
  };

  const filteredHistory = history.filter((item) => {
    if (winnerFilter !== "all" && item.result !== winnerFilter) return false;
    if (resultFilter !== "all" && item.result !== resultFilter) return false;
    if (dateFilter !== "all") {
      const itemDate = new Date(item.date);
      const now = new Date();
      const diff = now - itemDate;
      const hours = diff / (1000 * 60 * 60);
      if (dateFilter === "1h" && hours > 1) return false;
      if (dateFilter === "2h" && hours > 2) return false;
      if (dateFilter === "12h" && hours > 12) return false;
      if (dateFilter === "24h" && hours > 24) return false;
    }
    return true;
  });

  const paginatedHistory = filteredHistory.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className={`min-h-screen p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Rock, Paper, Scissors</h1>
          <div className="flex items-center space-x-2">
            <Switch id="theme-switch" onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")} />
            <Label htmlFor="theme-switch">Dark Mode</Label>
          </div>
        </div>

        <Tabs defaultValue="game">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <Card>
              <CardHeader>
                <CardTitle>Make your choice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center space-x-4">
                  {choices.map((choice) => (
                    <Button key={choice} onClick={() => playGame(choice)}>
                      {choice}
                    </Button>
                  ))}
                </div>
                {result && (
                  <div className="text-center">
                    <p>You chose: {userChoice}</p>
                    <p>Computer chose: {computerChoice}</p>
                    <p className="font-bold mt-2">{result}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Game History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <Select onValueChange={setWinnerFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by winner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="You Win!">User Wins</SelectItem>
                      <SelectItem value="Computer Wins!">Computer Wins</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setResultFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="You Win!">Win</SelectItem>
                      <SelectItem value="Computer Wins!">Loss</SelectItem>
                      <SelectItem value="It's a Tie!">Tie</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1h">Last 1 hour</SelectItem>
                      <SelectItem value="2h">Last 2 hours</SelectItem>
                      <SelectItem value="12h">Last 12 hours</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ul className="space-y-2">
                  {paginatedHistory.map((item) => (
                    <li key={item.id} className="border p-2 rounded">
                      {new Date(item.date).toLocaleString()} - User: {item.userChoice}, Computer: {item.computerChoice},{" "}
                      Result: {item.result}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between mt-4">
                  <Button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * 5 >= filteredHistory.length}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Total User Wins: {stats.userWins}</li>
                  <li>Total Computer Wins: {stats.computerWins}</li>
                  <li>Number of Ties: {stats.ties}</li>
                  <li>Average Round Duration: {stats.averageDuration.toFixed(2)} ms</li>
                  <li>User Win Percentage: {((stats.userWins / stats.totalRounds) * 100).toFixed(2)}%</li>
                  <li>Computer Win Percentage: {((stats.computerWins / stats.totalRounds) * 100).toFixed(2)}%</li>
                  <li>
                    Most Frequent User Choice:{" "}
                    {Object.entries(stats.userChoices).reduce((a, b) => (a[1] > b[1] ? a : b))[0]}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}