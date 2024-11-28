import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for tutorials and quizzes
const tutorials = [
  {
    id: 1,
    title: "React",
    content: "React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage the state of your application efficiently. Key concepts include JSX, components, props, and hooks.",
  },
  {
    id: 2,
    title: "Node.js",
    content: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, enabling the development of scalable network applications. Key features include its event-driven, non-blocking I/O model.",
  },
  {
    id: 3,
    title: "SQL",
    content: "SQL (Structured Query Language) is a standard language for managing and manipulating relational databases. It allows you to create, read, update, and delete data in databases. Key concepts include tables, queries, joins, and indexes.",
  },
];

const quizzes = [
  {
    id: 1,
    topic: "React",
    questions: [
      {
        question: "What is JSX?",
        options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
        correctAnswer: 0,
      },
      // Add 9 more questions here
    ],
  },
  // Add quizzes for Node.js and SQL
];

const QuizQuestion = ({ question, options, onAnswer }) => {
  return (
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
};

const Tutorial = ({ title, content, onStartQuiz }) => {
  return (
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
};

const Profile = ({ quizResults, onSort, onFilter }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Select onValueChange={(value) => onFilter("score", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High to Low</SelectItem>
              <SelectItem value="low">Low to High</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" placeholder="Filter by Date" onChange={(e) => onFilter("date", e.target.value)} />
          <Select onValueChange={(value) => onFilter("time", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Fastest</SelectItem>
              <SelectItem value="slow">Slowest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onSort("topic")}>Topic</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("date")}>Date & Time</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("score")}>Score</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("time")}>Time Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizResults.map((result, index) => (
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

export default function App() {
  const [currentView, setCurrentView] = useState("tutorials");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const startQuiz = (topicId) => {
    const quiz = quizzes.find((q) => q.id === topicId);
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setStartTime(Date.now());
    setCurrentView("quiz");
  };

  const handleAnswer = (answerIndex) => {
    if (answerIndex === currentQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      const newResult = {
        topic: currentQuiz.topic,
        date: new Date().toLocaleString(),
        score: `${score + 1}/10`,
        timeTaken: `${timeTaken} seconds`,
      };
      setQuizResults([...quizResults, newResult]);
      setCurrentView("profile");
    }
  };

  const handleSort = (column) => {
    const sortedResults = [...quizResults].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setQuizResults(sortedResults);
  };

  const handleFilter = (type, value) => {
    // Implement filtering logic here
    console.log(`Filtering by ${type}: ${value}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Educational App</h1>
      <div className="mb-4">
        <Button className="mr-2" onClick={() => setCurrentView("tutorials")}>
          Tutorials
        </Button>
        <Button onClick={() => setCurrentView("profile")}>My Profile</Button>
      </div>
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
      {currentView === "quiz" && currentQuiz && (
        <QuizQuestion
          question={currentQuiz.questions[currentQuestion].question}
          options={currentQuiz.questions[currentQuestion].options}
          onAnswer={handleAnswer}
        />
      )}
      {currentView === "profile" && (
        <Profile quizResults={quizResults} onSort={handleSort} onFilter={handleFilter} />
      )}
    </div>
  );
}