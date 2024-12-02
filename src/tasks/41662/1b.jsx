import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data
const sampleData = [
  { date: "2024-10-10", type: "Running", calories: 300, startTime: "07:00", endTime: "08:00" },
  { date: "2024-10-10", type: "Cycling", calories: 400, startTime: "18:00", endTime: "19:30" },
  // ... (18 more sample data entries)
];

export default function App() {
  const [workouts, setWorkouts] = useState(sampleData);
  const [newWorkout, setNewWorkout] = useState({
    date: "", type: "", calories: "", startTime: "", endTime: ""
  });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState("This week");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Calculate calories burned this week
  const caloriesBurnedThisWeek = workouts
    .filter(workout => isThisWeek(new Date(workout.date)))
    .reduce((total, workout) => total + workout.calories, 0);

  // Calculate goal progress
  const goalProgress = Math.min((caloriesBurnedThisWeek / calorieGoal) * 100, 100);

  // Handle input changes for new workout
  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  // Add new workout
  const addWorkout = () => {
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for future date");
      return;
    }
    setWorkouts([...workouts, { ...newWorkout, calories: parseInt(newWorkout.calories) }]);
    setNewWorkout({ date: "", type: "", calories: "", startTime: "", endTime: "" });
  };

  // Filter workouts based on selected filter
  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    switch (filter) {
      case "This week": return isThisWeek(workoutDate);
      case "Last week": return isLastWeek(workoutDate);
      case "This month": return isThisMonth(workoutDate);
      case "Last month": return isLastMonth(workoutDate);
      case "Last 2 months": return isLastNMonths(workoutDate, 2);
      case "Last 3 months": return isLastNMonths(workoutDate, 3);
      default: return true;
    }
  });

  // Sort workouts
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === "date") {
      return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    }
    if (sortBy === "calories") {
      return sortOrder === "asc" ? a.calories - b.calories : b.calories - a.calories;
    }
    if (sortBy === "timeSpent") {
      const aTime = getTimeSpent(a.startTime, a.endTime);
      const bTime = getTimeSpent(b.startTime, b.endTime);
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    }
    return 0;
  });

  // Handle column header click for sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{caloriesBurnedThisWeek} kCal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <p className="mt-2">{goalProgress.toFixed(2)}% of {calorieGoal} kCal</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Set calorie goal for the week"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This week">This week</SelectItem>
            <SelectItem value="Last week">Last week</SelectItem>
            <SelectItem value="This month">This month</SelectItem>
            <SelectItem value="Last month">Last month</SelectItem>
            <SelectItem value="Last 2 months">Last 2 months</SelectItem>
            <SelectItem value="Last 3 months">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No.</TableHead>
            <TableHead onClick={() => handleSort("date")} className="cursor-pointer">Date</TableHead>
            <TableHead>Workout Type</TableHead>
            <TableHead onClick={() => handleSort("calories")} className="cursor-pointer">Calories Burned (kCal)</TableHead>
            <TableHead onClick={() => handleSort("timeSpent")} className="cursor-pointer">Time Spent</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkouts.map((workout, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{workout.date}</TableCell>
              <TableCell>{workout.type}</TableCell>
              <TableCell>{workout.calories}</TableCell>
              <TableCell>{getTimeSpent(workout.startTime, workout.endTime)} minutes</TableCell>
              <TableCell>{workout.startTime}</TableCell>
              <TableCell>{workout.endTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Input type="date" name="date" value={newWorkout.date} onChange={handleInputChange} placeholder="Date" />
        <Input type="text" name="type" value={newWorkout.type} onChange={handleInputChange} placeholder="Workout Type" />
        <Input type="number" name="calories" value={newWorkout.calories} onChange={handleInputChange} placeholder="Calories Burned" />
        <Input type="time" name="startTime" value={newWorkout.startTime} onChange={handleInputChange} placeholder="Start Time" />
        <Input type="time" name="endTime" value={newWorkout.endTime} onChange={handleInputChange} placeholder="End Time" />
      </div>
      <Button onClick={addWorkout} className="mt-4">Add Workout</Button>
    </div>
  );
}

// Helper functions
function isThisWeek(date) {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
  return date >= weekStart && date <= weekEnd;
}

function isLastWeek(date) {
  const now = new Date();
  const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
  const lastWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1);
  return date >= lastWeekStart && date <= lastWeekEnd;
}

function isThisMonth(date) {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isLastMonth(date) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
}

function isLastNMonths(date, n) {
  const now = new Date();
  const monthsAgo = new Date(now.getFullYear(), now.getMonth() - n, 1);
  return date >= monthsAgo;
}

function getTimeSpent(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  return Math.round((end - start) / 60000);
}