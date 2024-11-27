import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample questions for the quiz
const sampleQuestions = [
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
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
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

const QuizResults = ({ score, totalQuestions, time, restartQuiz }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Score: {score} / {totalQuestions}</p>
        <p>Time taken: {time} seconds</p>
        <Button onClick={restartQuiz} className="mt-4">Restart Quiz</Button>
      </CardContent>
    </Card>
  );
};

const AddQuestion = ({ addQuestion }) => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "easy",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addQuestion(newQuestion);
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
        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
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
        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
      />
      <Select
        value={newQuestion.difficulty}
        onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </Select>
      <Button type="submit">Add Question</Button>
    </form>
  );
};

const QuestionList = ({ questions, searchTerm }) => {
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
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [time, setTime] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!showResults) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showResults]);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setTime(0);
  };

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

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
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </div>
          {!showResults ? (
            <>
              <div className="mb-4">
                <p>Question {currentQuestion + 1} of {filteredQuestions.length}</p>
                <p>Time: {time} seconds</p>
                <p>Score: {score}</p>
              </div>
              <QuizQuestion
                question={filteredQuestions[currentQuestion].question}
                options={filteredQuestions[currentQuestion].options}
                onAnswer={handleAnswer}
              />
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