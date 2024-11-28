import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const predefinedExercises = [
  { exercise_name: "Running", time: 30, expected_calorie_burn: 300, steps: "1. Warm up 2. Run at steady pace 3. Cool down" },
  { exercise_name: "Push-ups", time: 15, expected_calorie_burn: 100, steps: "1. Start in plank position 2. Lower body 3. Push back up" },
  { exercise_name: "Yoga", time: 45, expected_calorie_burn: 150, steps: "1. Sun salutations 2. Standing poses 3. Floor poses" },
  // ... Add 17 more exercises here
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [calorieFilter, setCalorieFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const filteredExercises = predefinedExercises.filter(
    (exercise) =>
      exercise.exercise_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (timeFilter === "" || exercise.time <= parseInt(timeFilter)) &&
      (calorieFilter === "" || exercise.expected_calorie_burn <= parseInt(calorieFilter))
  );

  const addExercise = () => {
    if (selectedExercise && selectedDay) {
      const isDuplicate = exercises.some(
        (e) => e.exercise_name === selectedExercise.exercise_name && e.day_of_week_to_perform === selectedDay
      );
      if (isDuplicate) {
        alert("This exercise already exists for the selected day!");
      } else {
        setExercises([...exercises, { ...selectedExercise, day_of_week_to_perform: selectedDay }]);
        setShowAddDialog(false);
      }
    }
  };

  const removeExercise = (exercise) => {
    setExercises(exercises.filter((e) => e !== exercise));
    setShowDeleteDialog(false);
  };

  const sortedExercises = [...exercises].sort((a, b) => {
    if (sortBy === "time") return a.time - b.time;
    if (sortBy === "calorie") return a.expected_calorie_burn - b.expected_calorie_burn;
    return 0;
  });

  const dailySummary = daysOfWeek.map((day) => {
    const dayExercises = exercises.filter((e) => e.day_of_week_to_perform === day);
    return {
      day,
      totalTime: dayExercises.reduce((sum, e) => sum + e.time, 0),
      totalCalories: dayExercises.reduce((sum, e) => sum + e.expected_calorie_burn, 0),
    };
  });

  const weeklySummary = {
    totalTime: dailySummary.reduce((sum, day) => sum + day.totalTime, 0),
    totalCalories: dailySummary.reduce((sum, day) => sum + day.totalCalories, 0),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Routine Tracker</h1>
      <Tabs defaultValue="exercises">
        <TabsList>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="myExercises">My Exercises</TabsTrigger>
        </TabsList>
        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Exercise List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input
                  placeholder="Search exercises"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  <Card key={exercise.exercise_name}>
                    <CardHeader>
                      <CardTitle>{exercise.exercise_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Time: {exercise.time} minutes</p>
                      <p>Calories: {exercise.expected_calorie_burn}</p>
                      <p>Steps: {exercise.steps}</p>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setShowAddDialog(true);
                        }}
                      >
                        Add to Routine
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="myExercises">
          <Card>
            <CardHeader>
              <CardTitle>My Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="calorie">Calorie Burn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sortedExercises.map((exercise, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{exercise.exercise_name}</p>
                      <p>Time: {exercise.time} minutes</p>
                      <p>Calories: {exercise.expected_calorie_burn}</p>
                      <p>Day: {exercise.day_of_week_to_perform}</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setExerciseToDelete(exercise);
                        setShowDeleteDialog(true);
                      }}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <h2 className="text-xl font-bold mt-4">Daily Summary</h2>
              {dailySummary.map((summary) => (
                <p key={summary.day}>
                  {summary.day}: {summary.totalTime} minutes, {summary.totalCalories} calories
                </p>
              ))}
              <h2 className="text-xl font-bold mt-4">Weekly Summary</h2>
              <p>Total Time: {weeklySummary.totalTime} minutes</p>
              <p>Total Calories: {weeklySummary.totalCalories} calories</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Exercise to Routine</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={addExercise}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the exercise from your routine.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeExercise(exerciseToDelete)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}