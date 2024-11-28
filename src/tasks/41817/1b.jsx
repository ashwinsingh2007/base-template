import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "@/components/ui/toast";

const predefinedExercises = [
  { exercise_name: "Running", time: 30, expected_calorie_burn: 300, steps: "1. Warm up 2. Run at steady pace 3. Cool down" },
  { exercise_name: "Push-ups", time: 15, expected_calorie_burn: 100, steps: "1. Start in plank position 2. Lower body 3. Push back up" },
  { exercise_name: "Yoga", time: 45, expected_calorie_burn: 150, steps: "1. Sun salutations 2. Standing poses 3. Seated poses" },
  // ... Add 17 more exercises here
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function App() {
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState({ name: "", time: "", calories: "" });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");

  const filteredExercises = predefinedExercises.filter(
    (exercise) =>
      exercise.exercise_name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.time === "" || exercise.time <= parseInt(filter.time)) &&
      (filter.calories === "" || exercise.expected_calorie_burn <= parseInt(filter.calories))
  );

  const addExercise = () => {
    if (!selectedExercise || !selectedDay) {
      toast({ title: "Error", description: "Please select an exercise and a day." });
      return;
    }

    const isDuplicate = exercises.some(
      (e) => e.exercise_name === selectedExercise.exercise_name && e.day_of_week_to_perform === selectedDay
    );

    if (isDuplicate) {
      toast({ title: "Error", description: "This exercise is already scheduled for this day." });
      return;
    }

    setExercises([...exercises, { ...selectedExercise, day_of_week_to_perform: selectedDay }]);
    toast({ title: "Success", description: "Exercise added to your routine." });
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
    toast({ title: "Success", description: "Exercise removed from your routine." });
  };

  const calculateSummary = () => {
    const summary = { daily: {}, weekly: { time: 0, calories: 0 } };
    exercises.forEach((exercise) => {
      if (!summary.daily[exercise.day_of_week_to_perform]) {
        summary.daily[exercise.day_of_week_to_perform] = { time: 0, calories: 0 };
      }
      summary.daily[exercise.day_of_week_to_perform].time += exercise.time;
      summary.daily[exercise.day_of_week_to_perform].calories += exercise.expected_calorie_burn;
      summary.weekly.time += exercise.time;
      summary.weekly.calories += exercise.expected_calorie_burn;
    });
    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Routine Tracker</h1>
      <Tabs defaultValue="exercises">
        <TabsList>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="my-exercises">My Exercises</TabsTrigger>
        </TabsList>
        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Exercise List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Search by name"
                  value={filter.name}
                  onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max time (minutes)"
                  value={filter.time}
                  onChange={(e) => setFilter({ ...filter, time: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max calories"
                  value={filter.calories}
                  onChange={(e) => setFilter({ ...filter, calories: e.target.value })}
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-2">Add to Routine</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Exercise to Routine</DialogTitle>
                          </DialogHeader>
                          <Select onValueChange={(value) => setSelectedDay(value)}>
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
                          <Button onClick={() => { setSelectedExercise(exercise); addExercise(); }}>
                            Confirm
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="my-exercises">
          <Card>
            <CardHeader>
              <CardTitle>My Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Time</th>
                      <th>Calories</th>
                      <th>Day</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.map((exercise, index) => (
                      <tr key={index}>
                        <td>{exercise.exercise_name}</td>
                        <td>{exercise.time}</td>
                        <td>{exercise.expected_calorie_burn}</td>
                        <td>{exercise.day_of_week_to_perform}</td>
                        <td>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive">Remove</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Removal</DialogTitle>
                              </DialogHeader>
                              <p>Are you sure you want to remove this exercise?</p>
                              <Button onClick={() => removeExercise(index)}>Confirm</Button>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {Object.entries(summary.daily).map(([day, data]) => (
                    <Card key={day}>
                      <CardHeader>
                        <CardTitle>{day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Total Time: {data.time} minutes</p>
                        <p>Total Calories: {data.calories}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Total Time: {summary.weekly.time} minutes</p>
                    <p>Total Calories: {summary.weekly.calories}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}