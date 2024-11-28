import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topics = [
  { name: 'React', content: 'React is a JavaScript library for building user interfaces. It uses components to manage state and render UI.', quiz: generateQuiz('React') },
  { name: 'Node.js', content: 'Node.js allows JavaScript to run on the server side, providing an environment for executing JavaScript outside of a browser.', quiz: generateQuiz('Node.js') },
  { name: 'SQL', content: 'SQL (Structured Query Language) is used to communicate with databases. It can retrieve, insert, update, and delete database records.', quiz: generateQuiz('SQL') },
];

function generateQuiz(topic) {
  return Array.from({ length: 10 }, (_, i) => ({
    question: `Question ${i + 1} about ${topic}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    answer: Math.floor(Math.random() * 4),
  }));
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [filter, setFilter] = useState({ score: '', date: '', time: '' });

  const handleTakeQuiz = (topicIndex) => {
    const quiz = topics[topicIndex].quiz;
    const startTime = new Date();
    const answers = quiz.map((q, i) => window.prompt(`${q.question}\n${q.options.join('\n')}`));
    const score = answers.filter((ans, i) => parseInt(ans) === quiz[i].answer).length;
    const endTime = new Date();
    setQuizResults(prev => [...prev, {
      topic: topics[topicIndex].name,
      score,
      date: endTime.toISOString(),
      timeTaken: (endTime - startTime) / 1000,
    }]);
  };

  const filteredResults = useMemo(() => {
    return quizResults.filter(result => 
      (filter.score === '' || result.score >= parseInt(filter.score)) &&
      (filter.date === '' || new Date(result.date).toISOString().startsWith(filter.date)) &&
      (filter.time === '' || result.timeTaken >= parseFloat(filter.time))
    );
  }, [quizResults, filter]);

  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      if (filter.sortBy === 'score') return b.score - a.score;
      if (filter.sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (filter.sortBy === 'time') return b.timeTaken - a.timeTaken;
      return 0;
    });
  }, [filteredResults, filter.sortBy]);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          {topics.map((topic, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{topic.content}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleTakeQuiz(index)}>Take Quiz</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="profile">
          <div className="mb-4">
            <Input 
              placeholder="Filter by Score" 
              value={filter.score} 
              onChange={(e) => setFilter(prev => ({...prev, score: e.target.value}))} 
              className="mr-2 mb-2 sm:mb-0"
            />
            <Input 
              placeholder="Filter by Date (YYYY-MM-DD)" 
              value={filter.date} 
              onChange={(e) => setFilter(prev => ({...prev, date: e.target.value}))} 
              className="mr-2 mb-2 sm:mb-0"
            />
            <Input 
              placeholder="Filter by Time Taken" 
              value={filter.time} 
              onChange={(e) => setFilter(prev => ({...prev, time: e.target.value}))} 
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => setFilter(prev => ({...prev, sortBy: 'topic'}))}>Topic</TableHead>
                <TableHead onClick={() => setFilter(prev => ({...prev, sortBy: 'score'}))}>Score</TableHead>
                <TableHead onClick={() => setFilter(prev => ({...prev, sortBy: 'date'}))}>Date</TableHead>
                <TableHead onClick={() => setFilter(prev => ({...prev, sortBy: 'time'}))}>Time Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, idx) => (
                <TableRow key={idx}>
                  <TableCell>{result.topic}</TableCell>
                  <TableCell>{result.score}/10</TableCell>
                  <TableCell>{new Date(result.date).toLocaleString()}</TableCell>
                  <TableCell>{result.timeTaken.toFixed(2)}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}