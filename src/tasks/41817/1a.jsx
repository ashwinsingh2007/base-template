import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const exercises = [
  { name: "Running", time: 30, calories: 300, steps: "1. Warm up 2. Run at steady pace 3. Cool down" },
  { name: "Push-ups", time: 15, calories: 100, steps: "1. Start in plank position 2. Lower body 3. Push up" },
  { name: "Yoga", time: 45, calories: 150, steps: "1. Sun salutations 2. Standing poses 3. Cool down" },
  { name: "Cycling", time: 45, calories: 400, steps: "1. Adjust bike 2. Cycle at moderate intensity 3. Cool down" },
  { name: "Swimming", time: 30, calories: 250, steps: "1. Warm up 2. Swim laps 3. Cool down" },
  { name: "Squats", time: 20, calories: 150, steps: "1. Stand with feet shoulder-width apart 2. Lower body 3. Stand up" },
  { name: "Plank", time: 5, calories: 50, steps: "1. Start in push-up position 2. Hold 3. Release" },
  { name: "Jump Rope", time: 15, calories: 200, steps: "1. Start jumping 2. Maintain rhythm 3. Cool down" },
  { name: "Lunges", time: 20, calories: 120, steps: "1. Step forward 2. Lower body 3. Return to starting position" },
  { name: "Burpees", time: 10, calories: 100, steps: "1. Squat 2. Plank 3. Push-up 4. Jump" },
  { name: "Pilates", time: 45, calories: 175, steps: "1. Warm up 2. Core exercises 3. Cool down" },
  { name: "Deadlifts", time: 25, calories: 200, steps: "1. Approach bar 2. Lift with legs 3. Lower back down" },
  { name: "Mountain Climbers", time: 10, calories: 80, steps: "1. Start in plank 2. Alternate knee drives 3. Cool down" },
  { name: "Rowing", time: 30, calories: 250, steps: "1. Sit on machine 2. Row with proper form 3. Cool down" },
  { name: "Bench Press", time: 20, calories: 150, steps: "1. Lie on bench 2. Lower bar to chest 3. Press up" },
  { name: "Kettlebell Swings", time: 15, calories: 180, steps: "1. Start in squat 2. Swing kettlebell 3. Return to squat" },
  { name: "Box Jumps", time: 15, calories: 150, steps: "1. Approach box 2. Jump onto box 3. Step down" },
  { name: "Tricep Dips", time: 10, calories: 70, steps: "1. Grip bars 2. Lower body 3. Push back up" },
  { name: "Battle Ropes", time: 10, calories: 100, steps: "1. Grip ropes 2. Create waves 3. Maintain for duration" },
  { name: "Stair Climbing", time: 20, calories: 180, steps: "1. Find stairs 2. Climb at steady pace 3. Cool down" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ExerciseList({ exercises, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [calorieFilter, setCalorieFilter] = useState("");

  const filteredExercises = exercises.filter((exercise) => {
    return (
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (timeFilter === "" || exercise.time <= parseInt(timeFilter)) &&
      (calorieFilter === "" || exercise.calories <= parseInt(calorieFilter))
    );
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search exercises"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Max time (minutes)"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max calories"
          value={calorieFilter}
          onChange={(e) => setCalorieFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.name} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelect(exercise)}>
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Time: {exercise.time} minutes</p>
              <p>Calories: {exercise.calories}</p>
              <p className="text-sm mt-2">{exercise.steps}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MyExercises({ routines, onRemove }) {
  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => (
        <Card key={day}>
          <CardHeader>
            <CardTitle>{day}</CardTitle>
          </CardHeader>
          <CardContent>
            {routines[day] && routines[day].length > 0 ? (
              routines[day].map((exercise, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{exercise.name} - {exercise.time} min, {exercise.calories} cal</span>
                  <Button variant="destructive" size="sm" onClick={() => onRemove(day, index)}>Remove</Button>
                </div>
              ))
            ) : (
              <p>No exercises scheduled</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [routines, setRoutines] = useState({});
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  const handleSelectExercise = (exercise) => {
    setRoutines((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), exercise],
    }));
  };

  const handleRemoveExercise = (day, index) => {
    setRoutines((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Routine Tracker</h1>
      <Tabs defaultValue="exercises">
        <TabsList className="mb-4">
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="myExercises">My Exercises</TabsTrigger>
        </TabsList>
        <TabsContent value="exercises">
          <div className="mb-4">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ExerciseList exercises={exercises} onSelect={handleSelectExercise} />
        </TabsContent>
        <TabsContent value="myExercises">
          <MyExercises routines={routines} onRemove={handleRemoveExercise} />
        </TabsContent>
      </Tabs>
    </div>
  );
}