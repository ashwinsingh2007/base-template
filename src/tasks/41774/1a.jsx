import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Icons for Rock, Paper, Scissors
const RockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const PaperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="6" r="3"/>
    <path d="M20 12L4 12"/>
  </svg>
);

const choices = ["Rock", "Paper", "Scissors"];

const GameButton = ({ choice, onClick, disabled }) => (
  <Button
    onClick={() => onClick(choice)}
    disabled={disabled}
    className="flex flex-col items-center justify-center p-4 w-24 h-24"
  >
    {choice === "Rock" && <RockIcon />}
    {choice === "Paper" && <PaperIcon />}
    {choice === "Scissors" && <ScissorsIcon />}
    <span className="mt-2">{choice}</span>
  </Button>
);

const ResultDisplay = ({ result }) => (
  <div className="text-center mt-4 text-xl font-bold">
    {result === "You Win!" && <span className="text-green-500">{result}</span>}
    {result === "Computer Wins!" && <span className="text-red-500">{result}</span>}
    {result === "It's a Tie!" && <span className="text-yellow-500">{result}</span>}
  </div>
);

const HistoryItem = ({ round, userChoice, computerChoice, result }) => (
  <div className="flex justify-between items-center border-b py-2">
    <span>Round {round}</span>
    <span>{userChoice} vs {computerChoice}</span>
    <span className={`font-bold ${
      result === "You Win!" ? "text-green-500" :
      result === "Computer Wins!" ? "text-red-500" :
      "text-yellow-500"
    }`}>
      {result}
    </span>
  </div>
);

export default function App() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ user: 0, computer: 0 });
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black";
  }, [isDarkMode]);

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(computerChoice);
    const roundResult = determineWinner(choice, computerChoice);
    setResult(roundResult);
    updateScore(roundResult);
    addToHistory(choice, computerChoice, roundResult);
  };

  const determineWinner = (user, computer) => {
    if (user === computer) return "It's a Tie!";
    if (
      (user === "Rock" && computer === "Scissors") ||
      (user === "Paper" && computer === "Rock") ||
      (user === "Scissors" && computer === "Paper")
    ) {
      return "You Win!";
    }
    return "Computer Wins!";
  };

  const updateScore = (result) => {
    setScore((prevScore) => ({
      user: prevScore.user + (result === "You Win!" ? 1 : 0),
      computer: prevScore.computer + (result === "Computer Wins!" ? 1 : 0),
    }));
  };

  const addToHistory = (userChoice, computerChoice, result) => {
    setHistory((prevHistory) => [
      { round: prevHistory.length + 1, userChoice, computerChoice, result },
      ...prevHistory,
    ]);
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? "dark" : ""}`}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Rock, Paper, Scissors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>Score: You {score.user} - {score.computer} Computer</div>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
          <Tabs defaultValue="game">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="game">Game</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="game">
              <div className="flex justify-center space-x-4 mb-4">
                {choices.map((choice) => (
                  <GameButton
                    key={choice}
                    choice={choice}
                    onClick={handleUserChoice}
                    disabled={!!userChoice}
                  />
                ))}
              </div>
              {result && (
                <>
                  <ResultDisplay result={result} />
                  <div className="text-center mt-4">
                    <p>You chose: {userChoice}</p>
                    <p>Computer chose: {computerChoice}</p>
                  </div>
                  <div className="text-center mt-4">
                    <Button onClick={resetGame}>Play Again</Button>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="history">
              <div className="max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                  <HistoryItem key={index} {...item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}