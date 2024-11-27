import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample questions for the quiz
const sampleQuestions = [
  // Each question contains the text, options, correct answer, and difficulty level
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    difficulty: "easy",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    difficulty: "easy",
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    difficulty: "medium",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctAnswer: "Leonardo da Vinci",
    difficulty: "medium",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Cu"],
    correctAnswer: "Au",
    difficulty: "hard",
  },
];

// Component to display a quiz question with options
const QuizQuestion = ({ question, options, onAnswer }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => (
            <Button key={index} onClick={() => onAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display quiz results
const QuizResults = ({ score, totalQuestions, time, restartQuiz }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Score: {score} / {totalQuestions}
        </p>
        <p>Time taken: {time} seconds</p>
        <Button onClick={restartQuiz} className="mt-4">
          Restart Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

// Component to add a new quiz question
const AddQuestion = ({ addQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "easy",
  });

  // Handles form submission to add a new question
  const handleSubmit = (e) => {
    e.preventDefault();
    addQuestion(newQuestion);
    // Reset the input fields after adding the question
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "easy",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Question"
        value={newQuestion.question}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, question: e.target.value })
        }
      />
      {newQuestion.options.map((option, index) => (
        <Input
          key={index}
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...newQuestion.options];
            newOptions[index] = e.target.value;
            setNewQuestion({ ...newQuestion, options: newOptions });
          }}
        />
      ))}
      <Input
        placeholder="Correct Answer"
        value={newQuestion.correctAnswer}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
        }
      />
      <Select
        value={newQuestion.difficulty}
        onValueChange={(value) =>
          setNewQuestion({ ...newQuestion, difficulty: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit">Add Question</Button>
    </form>
  );
};

// Component to display the list of questions with filtering
const QuestionList = ({ questions, searchTerm }) => {
  // Filters questions based on the search term
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Correct Answer</TableHead>
          <TableHead>Difficulty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredQuestions.map((q, index) => (
          <TableRow key={index}>
            <TableCell>{q.question}</TableCell>
            <TableCell>{q.correctAnswer}</TableCell>
            <TableCell>{q.difficulty}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function App() {
  const [questions, setQuestions] = useState(sampleQuestions); // Holds the list of questions
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index of the current question in the quiz
  const [score, setScore] = useState(0); // Stores the current quiz score
  const [showResults, setShowResults] = useState(false); // Whether to show results or the next question
  const [time, setTime] = useState(0); // Tracks time spent on the quiz
  const [difficulty, setDifficulty] = useState("easy"); // Selected difficulty level
  const [searchTerm, setSearchTerm] = useState(""); // Term to search questions in the manage tab

  // Timer to track quiz duration
  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults]);

  // Reset the current question when the difficulty changes
  useEffect(() => {
    setCurrentQuestion(0);
  }, [difficulty]);

  // Handles user answer submission
  const handleAnswer = (answer) => {
    if (filteredQuestions[currentQuestion]?.correctAnswer === answer) {
      setScore(score + 1); // Increment score if answer is correct
    }
    // Move to the next question or show results if it's the last question
    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  // Restarts the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setTime(0);
  };

  // Adds a new question to the list
  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  // Filters questions based on the selected difficulty
  const filteredQuestions = questions.filter((q) => q.difficulty === difficulty);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="quiz">
        <TabsList className="mb-4">
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="manage">Manage Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <div className="mb-4">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {!showResults ? (
            <>
              <div className="mb-4">
                <p>
                  Question {currentQuestion + 1} of {filteredQuestions.length}
                </p>
                <p>Time: {time} seconds</p>
                <p>Score: {score}</p>
              </div>
              {filteredQuestions[currentQuestion] ? (
                <QuizQuestion
                  question={filteredQuestions[currentQuestion].question}
                  options={filteredQuestions[currentQuestion].options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <p>No questions available for this difficulty.</p>
              )}
            </>
          ) : (
            <QuizResults
              score={score}
              totalQuestions={filteredQuestions.length}
              time={time}
              restartQuiz={restartQuiz}
            />
          )}
        </TabsContent>
        <TabsContent value="manage">
          <div className="space-y-4">
            <AddQuestion addQuestion={addQuestion} />
            <Input
              placeholder="Search questions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <QuestionList questions={questions} searchTerm={searchTerm} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
