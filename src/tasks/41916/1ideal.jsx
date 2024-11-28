import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for tutorials and quizzes
// Array of tutorials with details about React, Node.js, and SQL
const tutorials = [
  {
    id: 1,
    title: "React",
    content: "React is a JavaScript library for building user interfaces...",
  },
  {
    id: 2,
    title: "Node.js",
    content: "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
  },
  {
    id: 3,
    title: "SQL",
    content: "SQL (Structured Query Language) is a standard language...",
  },
];

// Array of quizzes with topics and questions related to React, Node.js, and SQL
const quizzes = [
    {
      id: 1,
      topic: "React",
      questions: Array.from({ length: 10 }, (_, index) => ({
        question: `React Question ${index + 1}: What does React do?`,
        options: [
          "Manages the DOM",
          "Handles APIs",
          "Handles Backend",
          `Option ${index + 4}`,
        ],
        correctAnswer: 0, // Always the first option as the correct answer for simplicity
      })),
    },
    {
      id: 2,
      topic: "Node.js",
      questions: Array.from({ length: 10 }, (_, index) => ({
        question: `Node.js Question ${index + 1}: What is Node.js used for?`,
        options: [
          "Server-side scripting",
          "Frontend development",
          "Database management",
          `Option ${index + 4}`,
        ],
        correctAnswer: 0,
      })),
    },
    {
      id: 3,
      topic: "SQL",
      questions: Array.from({ length: 10 }, (_, index) => ({
        question: `SQL Question ${index + 1}: What does SQL stand for?`,
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          `Option ${index + 4}`,
        ],
        correctAnswer: 0,
      })),
    },
  ];

// Component to display a single quiz question with options
const QuizQuestion = ({ question, options, onAnswer }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{question}</CardTitle>
    </CardHeader>
    <CardContent>
      {options.map((option, index) => (
        <Button key={index} className="mr-2 mb-2" onClick={() => onAnswer(index)}>
          {option}
        </Button>
      ))}
    </CardContent>
  </Card>
);

// Component to display tutorial details with a "Take Quiz" button
const Tutorial = ({ title, content, onStartQuiz }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
      <Button className="mt-4" onClick={onStartQuiz}>
        Take Quiz
      </Button>
    </CardContent>
  </Card>
);

// Component to display the profile section, including quiz results and filters
const Profile = ({ quizResults, filters, setFilters, onSort }) => {
  // Filter quiz results based on user input
  const filteredResults = quizResults
    .filter((result) => {
      if (filters.date && new Date(result.date).toLocaleDateString() !== filters.date) {
        return false;
      }
      if (filters.score !== null && filters.score !== undefined) {
        const scoreValue = parseInt(result.score.split("/")[0]);
        return scoreValue >= filters.score;
      }
      if (filters.time !== null && filters.time !== undefined) {
        const timeTakenValue = parseInt(result.timeTaken.split(" ")[0]);
        return timeTakenValue <= filters.time;
      }
      return true;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {/* Input for filtering by minimum score */}
          <Input
            type="number"
            placeholder="Minimum Score"
            onChange={(e) => setFilters({ ...filters, score: e.target.value ? parseInt(e.target.value) : null })}
            className="w-[180px]"
          />
          {/* Input for filtering by maximum time */}
          <Input
            type="number"
            placeholder="Maximum Time (seconds)"
            onChange={(e) => setFilters({ ...filters, time: e.target.value ? parseInt(e.target.value) : null })}
            className="w-[180px]"
          />
          {/* Input for filtering by date */}
          <Input
            type="date"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-[180px]"
          />
        </div>
        {/* Table to display filtered quiz results */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onSort("topic")}>
                Topic
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("date")}>
                Date & Time
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("score")}>
                Score
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("timeTaken")}>
                Time Taken
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.topic}</TableCell>
                <TableCell>{result.date}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>{result.timeTaken}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main application component
export default function App() {
    // State for managing the current view, active quiz, question, and other quiz-related details
    const [currentView, setCurrentView] = useState("tutorials");
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizResults, setQuizResults] = useState([]);
    const [filters, setFilters] = useState({ score: null, time: null, date: null });
    const [sortConfig, setSortConfig] = useState(null);
    const [startTime, setStartTime] = useState(null);
  
    // Function to start a quiz for a specific topic
    const startQuiz = (topicId) => {
      const quiz = quizzes.find((q) => q.id === topicId);
      setCurrentQuiz(quiz);
      setCurrentQuestion(0);
      setScore(0); // Reset the score at the start of the quiz
      setStartTime(Date.now()); // Track the start time
      setCurrentView("quiz");
    };
  
    // Function to handle answering a quiz question
    const handleAnswer = (answerIndex) => {
      const isCorrect = answerIndex === currentQuiz.questions[currentQuestion].correctAnswer;
  
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
  
      if (currentQuestion < currentQuiz.questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        // Finalize the quiz and calculate time taken
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);
  
        // Save the quiz results
        setQuizResults((prevResults) => [
          ...prevResults,
          {
            topic: currentQuiz.topic,
            date: new Date().toLocaleString(),
            score: `${score + (isCorrect ? 1 : 0)}/${currentQuiz.questions.length}`, // Include the last question's result
            timeTaken: `${timeTaken} seconds`,
          },
        ]);
  
        setCurrentView("profile"); // Navigate to profile after quiz
      }
    };
  
    // Function to sort quiz results based on a column
    const handleSort = (column) => {
      const direction = sortConfig?.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
      const sortedResults = [...quizResults].sort((a, b) => {
        if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
        if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setSortConfig({ key: column, direction });
      setQuizResults(sortedResults);
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Educational App</h1>
        <div className="mb-4">
          {/* Navigation buttons to switch views */}
          <Button className="mr-2" onClick={() => setCurrentView("tutorials")}>
            Tutorials
          </Button>
          <Button onClick={() => setCurrentView("profile")}>My Profile</Button>
        </div>
        {/* Render tutorials view */}
        {currentView === "tutorials" && (
          <div>
            {tutorials.map((tutorial) => (
              <Tutorial
                key={tutorial.id}
                title={tutorial.title}
                content={tutorial.content}
                onStartQuiz={() => startQuiz(tutorial.id)}
              />
            ))}
          </div>
        )}
        {/* Render quiz view */}
        {currentView === "quiz" && currentQuiz && (
          <QuizQuestion
            question={currentQuiz.questions[currentQuestion].question}
            options={currentQuiz.questions[currentQuestion].options}
            onAnswer={handleAnswer}
          />
        )}
        {/* Render profile view */}
        {currentView === "profile" && (
          <Profile quizResults={quizResults} filters={filters} setFilters={setFilters} onSort={handleSort} />
        )}
      </div>
    );
  }
