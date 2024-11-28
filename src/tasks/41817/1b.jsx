import React, { useState, useMemo } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input, Button, Select, SelectItem
} from "@/components/ui";

const exercises = [
  { name: "Jogging", time: 30, calorieBurn: 200, steps: "Run at a steady pace." },
  { name: "Push-ups", time: 10, calorieBurn: 50, steps: "Keep body straight, lower chest to ground." },
  // ... 18 more exercises ...
];

function formatDay(dayIndex) {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex];
}

function ExerciseList({ exercises, onSelect }) {
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [calorieFilter, setCalorieFilter] = useState('');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(search.toLowerCase()) &&
      (timeFilter === '' || ex.time === parseInt(timeFilter)) &&
      (calorieFilter === '' || ex.calorieBurn === parseInt(calorieFilter))
    );
  }, [search, timeFilter, calorieFilter, exercises]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select onValueChange={setTimeFilter}>
          <SelectItem value="">Time</SelectItem>
          <SelectItem value="10">10 min</SelectItem>
          <SelectItem value="20">20 min</SelectItem>
          {/* Add more time options */}
        </Select>
        <Select onValueChange={setCalorieFilter}>
          <SelectItem value="">Calories</SelectItem>
          <SelectItem value="50">50 cal</SelectItem>
          <SelectItem value="100">100 cal</SelectItem>
          {/* Add more calorie options */}
        </Select>
      </div>
      {filteredExercises.map(ex => (
        <Card key={ex.name} className="cursor-pointer" onClick={() => onSelect(ex)}>
          <CardHeader>
            <CardTitle>{ex.name}</CardTitle>
            <CardDescription>{ex.time} min, {ex.calorieBurn} cal</CardDescription>
          </CardHeader>
          <CardContent>{ex.steps}</CardContent>
        </Card>
      ))}
    </div>
  );
}

function MyExercises({ exercises, onRemove }) {
  return (
    <div className="space-y-4">
      {exercises.map((ex, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{ex.name}</CardTitle>
            <CardDescription>{ex.time} min, {ex.calorieBurn} cal, {formatDay(ex.day)}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => onRemove(index)}>Remove</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [view, setView] = useState('list');

  const addExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { ...exercise, day: new Date().getDay() }]);
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between">
        <Button onClick={() => setView('list')}>Exercise List</Button>
        <Button onClick={() => setView('myExercises')}>My Exercises</Button>
      </div>
      {view === 'list' ? 
        <ExerciseList exercises={exercises} onSelect={addExercise} /> : 
        <MyExercises exercises={selectedExercises} onRemove={removeExercise} />}
    </div>
  );
}