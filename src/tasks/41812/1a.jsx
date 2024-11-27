import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui";

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [tab, setTab] = useState('quiz');

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setIsRunning(false);
    }
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTime(0);
    setIsRunning(true);
  };

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
  };

  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(search.toLowerCase())
  );

  const [search, setSearch] = useState('');

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="quiz" className="w-full">
        <TabsList>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="add">Add & View Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Game</CardTitle>
              <select 
                onChange={(e) => setDifficulty(e.target.value)} 
                value={difficulty}
                className="p-2 border rounded ml-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </CardHeader>
            <CardContent>
              {isRunning ? (
                <>
                  <div>Time: {time}s</div>
                  <div>Score: {score}</div>
                  <div>{questions[currentQuestion]?.question}</div>
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <Button 
                      key={index} 
                      onClick={() => handleAnswer(option.isCorrect)} 
                      className="mt-2 w-full"
                    >
                      {option.text}
                    </Button>
                  ))}
                </>
              ) : (
                <div>
                  <p>Final Score: {score}</p>
                  <p>Time Taken: {time} seconds</p>
                  <Button onClick={startQuiz}>Start Quiz</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <AddQuestionForm onAddQuestion={addQuestion} />
          <Input 
            placeholder="Search questions..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="mt-4 mb-4"
          />
          <QuestionTable questions={filteredQuestions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddQuestionForm({ onAddQuestion }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
  const [correctOption, setCorrectOption] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctIndex = parseInt(correctOption);
    const newQuestion = {
      question,
      options: options.map((opt, index) => ({ ...opt, isCorrect: index === correctIndex }))
    };
    onAddQuestion(newQuestion);
    setQuestion('');
    setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    setCorrectOption(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Enter question" 
            required
          />
          {options.map((opt, index) => (
            <div key={index} className="mt-2">
              <Input 
                value={opt.text} 
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index].text = e.target.value;
                  setOptions(newOptions);
                }} 
                placeholder={`Option ${index + 1}`} 
                required
              />
            </div>
          ))}
          <select 
            onChange={(e) => setCorrectOption(e.target.value)} 
            value={correctOption} 
            className="mt-2 p-2 border rounded"
          >
            {options.map((_, index) => (
              <option key={index} value={index}>Option {index + 1}</option>
            ))}
          </select>
          <Button type="submit" className="mt-4">Add Question</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function QuestionTable({ questions }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Correct Answer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((q) => (
          <TableRow key={q.id}>
            <TableCell>{q.question}</TableCell>
            <TableCell>{q.options.find(o => o.isCorrect)?.text}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default QuizApp;