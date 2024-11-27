import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const choices = ["Rock", "Paper", "Scissors"]; // Array defining the game choices

// Function to generate dummy game history and initial scores
const generateDummyData = () => {
  const data = []; // Stores dummy game history
  const now = new Date(); // Current timestamp
  const score = { user: 0, computer: 0, ties: 0 }; // Initial score counters

  for (let i = 0; i < 10; i++) {
    const userChoice = choices[Math.floor(Math.random() * 3)]; // Random user choice
    const computerChoice = choices[Math.floor(Math.random() * 3)]; // Random computer choice
    let result;

    // Determine the result based on user and computer choices
    if (userChoice === computerChoice) {
      result = "It's a Tie!";
      score.ties += 1; // Increment tie count
    } else if (
      (userChoice === "Rock" && computerChoice === "Scissors") ||
      (userChoice === "Paper" && computerChoice === "Rock") ||
      (userChoice === "Scissors" && computerChoice === "Paper")
    ) {
      result = "You Win!";
      score.user += 1; // Increment user win count
    } else {
      result = "Computer Wins!";
      score.computer += 1; // Increment computer win count
    }

    // Push the game record to the history array
    data.push({
      id: i,
      userChoice,
      computerChoice,
      result,
      date: new Date(now.getTime() - i * 3600000).toISOString(), // Set a timestamp for the game
    });
  }

  return { data, score }; // Return the generated data and score
};

export default function App() {
  const { data: initialHistory, score: initialScore } = generateDummyData(); // Initialize state with dummy data
  const [userChoice, setUserChoice] = useState(null); // User's choice in the current game
  const [computerChoice, setComputerChoice] = useState(null); // Computer's choice in the current game
  const [result, setResult] = useState(""); // Result of the current game
  const [score, setScore] = useState(initialScore); // Current scores
  const [history, setHistory] = useState(initialHistory); // Game history
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filter, setFilter] = useState({ winner: "all", result: "all", timeRange: "all" }); // Filters for game history
  const [theme, setTheme] = useState("light"); // Current theme (light/dark)

  // Update the document theme class when the theme changes
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-black";
  }, [theme]);

  // Handle playing the game based on user's choice
  const playGame = (userChoice) => {
    const computerChoice = choices[Math.floor(Math.random() * 3)]; // Random computer choice
    setUserChoice(userChoice);
    setComputerChoice(computerChoice);

    let result;

    // Determine the game result
    if (userChoice === computerChoice) {
      result = "It's a Tie!";
      setScore((prev) => ({ ...prev, ties: prev.ties + 1 }));
    } else if (
      (userChoice === "Rock" && computerChoice === "Scissors") ||
      (userChoice === "Paper" && computerChoice === "Rock") ||
      (userChoice === "Scissors" && computerChoice === "Paper")
    ) {
      result = "You Win!";
      setScore((prev) => ({ ...prev, user: prev.user + 1 }));
    } else {
      result = "Computer Wins!";
      setScore((prev) => ({ ...prev, computer: prev.computer + 1 }));
    }

    setResult(result); // Update the game result

    // Add the game result to the history
    setHistory((prev) => [
      {
        id: prev.length,
        userChoice,
        computerChoice,
        result,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Filter the game history based on the current filter settings
  const filteredHistory = history.filter((item) => {
    if (filter.winner !== "all") {
      if (filter.winner === "user" && item.result !== "You Win!") return false;
      if (filter.winner === "computer" && item.result !== "Computer Wins!") return false;
      if (filter.winner === "tie" && item.result !== "It's a Tie!") return false;
    }

    if (filter.result !== "all") {
      if (filter.result === "Win" && item.result !== "You Win!") return false;
      if (filter.result === "Loss" && item.result !== "Computer Wins!") return false;
      if (filter.result === "Tie" && item.result !== "It's a Tie!") return false;
    }

    if (filter.timeRange !== "all") {
      const now = new Date();
      const itemDate = new Date(item.date);
      const hoursDiff = (now - itemDate) / (1000 * 60 * 60); // Calculate time difference in hours
      if (filter.timeRange === "1h" && hoursDiff > 1) return false;
      if (filter.timeRange === "2h" && hoursDiff > 2) return false;
      if (filter.timeRange === "12h" && hoursDiff > 12) return false;
      if (filter.timeRange === "24h" && hoursDiff > 24) return false;
    }

    return true; // Include the record if it passes all filters
  });

  // Paginate the filtered history
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * 5, currentPage * 5);

  // Calculate game statistics
  const stats = {
    totalUserWins: score.user,
    totalComputerWins: score.computer,
    totalTies: score.ties,
    userWinPercentage: ((score.user / (score.user + score.computer + score.ties)) * 100).toFixed(2),
    computerWinPercentage: ((score.computer / (score.user + score.computer + score.ties)) * 100).toFixed(2),
  };

  return (
    <div className={`container mx-auto p-4 ${theme === "dark" ? "dark" : ""}`}>
      {/* Theme toggle switch */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Switch id="theme-switch" onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")} />
          <Label htmlFor="theme-switch">Dark Mode</Label>
        </div>
      </div>

      {/* Tabs for navigating sections */}
      <Tabs defaultValue="game" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        {/* Game tab content */}
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Rock, Paper, Scissors</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Game buttons */}
              <div className="flex justify-center space-x-4 mb-4">
                {choices.map((choice) => (
                  <Button key={choice} onClick={() => playGame(choice)}>
                    {choice}
                  </Button>
                ))}
              </div>
              {/* Display result */}
              {result && (
                <div className="text-center">
                  <p>You chose: {userChoice}</p>
                  <p>Computer chose: {computerChoice}</p>
                  <p className="font-bold mt-2">{result}</p>
                </div>
              )}
              {/* Display score */}
              <div className="mt-4 text-center">
                <p>Score: You {score.user} - {score.computer} Computer (Ties: {score.ties})</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History tab content */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters for history */}
              <div className="flex space-x-4 mb-4">
                <Select onValueChange={(value) => setFilter((prev) => ({ ...prev, winner: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by winner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="computer">Computer</SelectItem>
                    <SelectItem value="tie">Tie</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilter((prev) => ({ ...prev, result: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Win">Win</SelectItem>
                    <SelectItem value="Loss">Loss</SelectItem>
                    <SelectItem value="Tie">Tie</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilter((prev) => ({ ...prev, timeRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="1h">Last 1 hour</SelectItem>
                    <SelectItem value="2h">Last 2 hours</SelectItem>
                    <SelectItem value="12h">Last 12 hours</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Paginated history display */}
              <ul className="space-y-2">
                {paginatedHistory.map((item) => (
                  <li key={item.id} className="border p-2 rounded">
                    {new Date(item.date).toLocaleString()} - {item.userChoice} vs {item.computerChoice}: {item.result}
                  </li>
                ))}
              </ul>
              {/* Pagination controls */}
              <div className="flex justify-between mt-4">
                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage * 5 >= filteredHistory.length}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics tab content */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display game statistics */}
              <ul className="space-y-2">
                <li>Total User Wins: {stats.totalUserWins}</li>
                <li>Total Computer Wins: {stats.totalComputerWins}</li>
                <li>Total Ties: {stats.totalTies}</li>
                <li>User Win Percentage: {stats.userWinPercentage}%</li>
                <li>Computer Win Percentage: {stats.computerWinPercentage}%</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
