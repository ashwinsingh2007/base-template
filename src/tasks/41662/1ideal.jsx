import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Generate 20 dummy data entries
const sampleData = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(2023, 6, i + 1); // July 2023
  const type = i % 2 === 0 ? "Running" : "Cycling";
  const calories = Math.floor(Math.random() * 500) + 100; // Random calories between 100 and 600
  const startHour = Math.floor(Math.random() * 12) + 6; // Random start hour between 6 and 18
  const endHour = startHour + 1;
  const start = `${startHour.toString().padStart(2, "0")}:00`;
  const end = `${endHour.toString().padStart(2, "0")}:30`;

  return {
    date: date.toISOString().split("T")[0],
    type,
    calories,
    start,
    end,
  };
});

export default function App() {
  const [workouts, setWorkouts] = useState(sampleData);
  const [newWorkout, setNewWorkout] = useState({ date: "", type: "", calories: "", start: "", end: "" });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState("This week");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Calculate metrics
  const currentWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return workoutDate >= weekStart;
  });

  const stepsThisWeek = currentWeekWorkouts.reduce((sum, w) => sum + (w.type === "Running" ? 1000 : 0), 0);
  const caloriesThisWeek = currentWeekWorkouts.reduce((sum, w) => sum + Number(w.calories), 0);
  const goalProgress = Math.min((caloriesThisWeek / calorieGoal) * 100, 100).toFixed(2);

  // Handle new workout submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for future date");
      return;
    }
    setWorkouts([...workouts, { ...newWorkout, calories: Number(newWorkout.calories) }]);
    setNewWorkout({ date: "", type: "", calories: "", start: "", end: "" });
  };

  // Handle input changes
  const handleChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  // Filter workouts based on selected filter
  const filterWorkouts = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (filter) {
      case "This week":
        return workouts.filter(w => new Date(w.date) >= weekStart);
      case "Last week":
        const lastWeekStart = new Date(weekStart.setDate(weekStart.getDate() - 7));
        return workouts.filter(w => new Date(w.date) >= lastWeekStart && new Date(w.date) < weekStart);
      case "This month":
        return workouts.filter(w => new Date(w.date) >= monthStart);
      case "Last month":
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return workouts.filter(w => new Date(w.date) >= lastMonthStart && new Date(w.date) < monthStart);
      case "Last 2 months":
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        return workouts.filter(w => new Date(w.date) >= twoMonthsAgo);
      case "Last 3 months":
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        return workouts.filter(w => new Date(w.date) >= threeMonthsAgo);
      default:
        return workouts;
    }
  };

  // Sort workouts
  const sortWorkouts = (workouts) => {
    if (!sortBy) return workouts;
    return [...workouts].sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "calories") {
        return sortOrder === "asc" ? a.calories - b.calories : b.calories - a.calories;
      } else if (sortBy === "timeSpent") {
        const getMinutes = (start, end) => {
          const [startHour, startMin] = start.split(":").map(Number);
          const [endHour, endMin] = end.split(":").map(Number);
          return (endHour * 60 + endMin) - (startHour * 60 + startMin);
        };
        const aTime = getMinutes(a.start, a.end);
        const bTime = getMinutes(b.start, b.end);
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }
    });
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedWorkouts = sortWorkouts(filterWorkouts());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Tracker</h1>
      
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Steps This Week</CardTitle>
          </CardHeader>
          <CardContent>{stepsThisWeek}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned This Week</CardTitle>
          </CardHeader>
          <CardContent>{caloriesThisWeek} kCal</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>{goalProgress}%</CardContent>
        </Card>
      </div>

      {/* Calorie Goal Input */}
      <div className="mb-4">
        <Input
          type="number"
          placeholder="Set Calorie Goal for the Week"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          className="w-full sm:w-auto"
        />
      </div>

      {/* New Workout Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input type="date" name="date" value={newWorkout.date} onChange={handleChange} required />
        <Input type="text" name="type" placeholder="Workout Type" value={newWorkout.type} onChange={handleChange} required />
        <Input type="number" name="calories" placeholder="Calories Burned" value={newWorkout.calories} onChange={handleChange} required />
        <Input type="time" name="start" value={newWorkout.start} onChange={handleChange} required />
        <Input type="time" name="end" value={newWorkout.end} onChange={handleChange} required />
        <Button type="submit">Add Workout</Button>
      </form>

      {/* Filter */}
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-full sm:w-[180px] mb-4">
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

      {/* Workout Table */}
      <div className="overflow-x-auto">
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
            {filteredAndSortedWorkouts.map((workout, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{workout.date}</TableCell>
                <TableCell>{workout.type}</TableCell>
                <TableCell>{workout.calories}</TableCell>
                <TableCell>
                  {(() => {
                    const [startHour, startMin] = workout.start.split(":").map(Number);
                    const [endHour, endMin] = workout.end.split(":").map(Number);
                    const diffMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                    return `${hours}h ${minutes}m`;
                  })()}
                </TableCell>
                <TableCell>{workout.start}</TableCell>
                <TableCell>{workout.end}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
