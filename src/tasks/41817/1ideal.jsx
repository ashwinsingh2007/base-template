// Importing necessary React hooks and components for the application
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Predefined list of exercises with their details
const predefinedExercises = [
    { exercise_name: "Running", time: 30, expected_calorie_burn: 300, steps: "1. Warm up 2. Run at steady pace 3. Cool down" },
    { exercise_name: "Push-ups", time: 15, expected_calorie_burn: 100, steps: "1. Start in plank position 2. Lower body 3. Push back up" },
    { exercise_name: "Yoga", time: 45, expected_calorie_burn: 150, steps: "1. Sun salutations 2. Standing poses 3. Floor poses" },
    { exercise_name: "Cycling", time: 60, expected_calorie_burn: 500, steps: "1. Adjust seat height 2. Start pedaling 3. Maintain steady pace" },
    { exercise_name: "Jumping Jacks", time: 10, expected_calorie_burn: 80, steps: "1. Stand straight 2. Jump with arms and legs apart 3. Return to starting position" },
    { exercise_name: "Squats", time: 20, expected_calorie_burn: 120, steps: "1. Stand with feet shoulder-width apart 2. Lower hips 3. Return to standing" },
    { exercise_name: "Plank", time: 5, expected_calorie_burn: 50, steps: "1. Get into push-up position 2. Keep body straight 3. Hold position" },
    { exercise_name: "Lunges", time: 20, expected_calorie_burn: 140, steps: "1. Stand tall 2. Step forward with one leg 3. Lower hips and alternate" },
    { exercise_name: "Burpees", time: 15, expected_calorie_burn: 150, steps: "1. Start in standing position 2. Drop into squat 3. Jump back to plank and return" },
    { exercise_name: "Mountain Climbers", time: 10, expected_calorie_burn: 100, steps: "1. Start in plank position 2. Alternate driving knees towards chest" },
    { exercise_name: "Swimming", time: 60, expected_calorie_burn: 400, steps: "1. Warm up 2. Swim laps 3. Cool down" },
    { exercise_name: "Walking", time: 30, expected_calorie_burn: 120, steps: "1. Wear comfortable shoes 2. Walk at steady pace 3. Maintain posture" },
    { exercise_name: "Pull-ups", time: 10, expected_calorie_burn: 100, steps: "1. Grip pull-up bar 2. Pull body up 3. Lower back down" },
    { exercise_name: "Dumbbell Curls", time: 20, expected_calorie_burn: 110, steps: "1. Hold dumbbells 2. Curl weights towards shoulders 3. Lower weights" },
    { exercise_name: "Bench Press", time: 30, expected_calorie_burn: 200, steps: "1. Lie on bench 2. Lower barbell to chest 3. Push barbell back up" },
    { exercise_name: "Deadlifts", time: 25, expected_calorie_burn: 250, steps: "1. Stand with barbell 2. Lift barbell keeping back straight 3. Lower barbell" },
    { exercise_name: "Rowing", time: 40, expected_calorie_burn: 300, steps: "1. Sit on rowing machine 2. Push legs and pull handle 3. Return to starting position" },
    { exercise_name: "Stretching", time: 15, expected_calorie_burn: 50, steps: "1. Stretch arms 2. Stretch legs 3. Hold each stretch for 10-15 seconds" },
    { exercise_name: "Boxing", time: 30, expected_calorie_burn: 400, steps: "1. Warm up 2. Practice punches and footwork 3. Cool down" },
    { exercise_name: "Hiking", time: 120, expected_calorie_burn: 600, steps: "1. Wear sturdy shoes 2. Follow trail 3. Maintain hydration" },
];

// List of days in a week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  // States for managing exercises, selected options, filters, and dialogs
  const [exercises, setExercises] = useState([]); // Stores user-added exercises
  const [selectedExercise, setSelectedExercise] = useState(null); // Currently selected exercise to add
  const [selectedDay, setSelectedDay] = useState(""); // Day selected for the exercise
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering exercises
  const [timeFilter, setTimeFilter] = useState(""); // Filter exercises by max time
  const [calorieFilter, setCalorieFilter] = useState(""); // Filter exercises by max calories
  const [showAddDialog, setShowAddDialog] = useState(false); // Controls the add exercise dialog visibility
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Controls the delete exercise dialog visibility
  const [exerciseToDelete, setExerciseToDelete] = useState(null); // Exercise to be deleted
  const [sortBy, setSortBy] = useState(""); // Sort option for exercises

  // Filters predefined exercises based on search term and filters
  const filteredExercises = predefinedExercises.filter(
    (exercise) =>
      exercise.exercise_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (timeFilter === "" || exercise.time <= parseInt(timeFilter)) &&
      (calorieFilter === "" || exercise.expected_calorie_burn <= parseInt(calorieFilter))
  );

  // Adds a selected exercise to the user's routine
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
        setSelectedDay("");
      }
    } else {
      alert("Please select a day to add the exercise.");
    }
  };

  // Removes an exercise from the user's routine
  const removeExercise = (exercise) => {
    setExercises(exercises.filter((e) => e !== exercise));
    setShowDeleteDialog(false);
  };

  // Sorts the user's exercises based on the selected criteria
  const sortedExercises = [...exercises].sort((a, b) => {
    if (sortBy === "time") return a.time - b.time;
    if (sortBy === "calorie") return a.expected_calorie_burn - b.expected_calorie_burn;
    return 0;
  });

  // Creates a summary of exercises for each day of the week
  const dailySummary = daysOfWeek.map((day) => {
    const dayExercises = exercises.filter((e) => e.day_of_week_to_perform === day);
    return {
      day,
      totalTime: dayExercises.reduce((sum, e) => sum + e.time, 0),
      totalCalories: dayExercises.reduce((sum, e) => sum + e.expected_calorie_burn, 0),
    };
  });

  // Creates a summary of total exercises for the week
  const weeklySummary = {
    totalTime: dailySummary.reduce((sum, day) => sum + day.totalTime, 0),
    totalCalories: dailySummary.reduce((sum, day) => sum + day.totalCalories, 0),
  };

  // Main UI rendering
  return (
    <div className="container mx-auto p-4">
      {/* Header for the application */}
      <h1 className="text-3xl font-bold mb-4">Fitness Routine Tracker</h1>

      {/* Tab system for switching between exercise list and user's routine */}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time (minutes)</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedExercises.map((exercise, index) => (
                    <TableRow key={index}>
                      <TableCell>{exercise.exercise_name}</TableCell>
                      <TableCell>{exercise.day_of_week_to_perform}</TableCell>
                      <TableCell>{exercise.time}</TableCell>
                      <TableCell>{exercise.expected_calorie_burn}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setExerciseToDelete(exercise);
                            setShowDeleteDialog(true);
                          }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

      {/* Dialog for adding an exercise */}
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

      {/* Dialog for confirming exercise deletion */}
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
