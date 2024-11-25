import React, { useState, useEffect } from "react";
// Importing reusable UI components like Card, Table, Input, Button, Select from the components folder.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to calculate time difference between start and end times of a workout session
const calculateTimeDifference = (start, end) => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const diffMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
};

// Utility function to get date ranges based on the selected filter (e.g., "This week", "Last month").
const getDateRange = (filter) => {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  switch (filter) {
    case "This week": // Start from the beginning of this week
      startDate.setDate(today.getDate() - today.getDay());
      break;
    case "Last week": // Start and end of last week
      startDate.setDate(today.getDate() - today.getDay() - 7);
      endDate.setDate(today.getDate() - today.getDay() - 1);
      break;
    case "This month": // Start from the first day of the current month
      startDate.setDate(1);
      break;
    case "Last month": // Last month's start and end dates
      startDate.setMonth(today.getMonth() - 1, 1);
      endDate.setDate(0);
      break;
    case "Last 2 months": // Start date two months back
      startDate.setMonth(today.getMonth() - 2, 1);
      break;
    case "Last 3 months": // Start date three months back
      startDate.setMonth(today.getMonth() - 3, 1);
      break;
    default: // Default to no changes
      break;
  }

  return { startDate, endDate };
};

export default function App() {
  // **State Definitions**
  // Holds the list of workouts added by the user
  const [workouts, setWorkouts] = useState([]);
  // Holds the current input values for a new workout being added
  const [newWorkout, setNewWorkout] = useState({
    date: "",
    type: "",
    calories: "",
    startTime: "",
    endTime: "",
  });
  // Stores the weekly calorie goal set by the user
  const [calorieGoal, setCalorieGoal] = useState(0);
  // Selected filter for viewing workouts by date ranges
  const [filter, setFilter] = useState("This week");
  // Stores the column by which the table should be sorted
  const [sortColumn, setSortColumn] = useState(null);
  // Stores the direction of sorting (ascending or descending)
  const [sortDirection, setSortDirection] = useState("asc");

  // **Metrics Calculations**
  // Determine the start and end dates for filtering workouts
  const { startDate, endDate } = getDateRange(filter);
  // Filter workouts based on the selected date range
  const filteredWorkouts = workouts.filter(
    (workout) => new Date(workout.date) >= startDate && new Date(workout.date) <= endDate
  );

  // Calculate total steps walked, assuming 1000 steps for each walking workout
  const stepsWalked = filteredWorkouts.reduce((sum, workout) => sum + (workout.type === "Walking" ? 1000 : 0), 0);
  // Calculate total calories burned from filtered workouts
  const caloriesBurned = filteredWorkouts.reduce((sum, workout) => sum + parseInt(workout.calories), 0);
  // Calculate goal progress as a percentage of the calorie goal
  const goalProgress = calorieGoal > 0 ? Math.min((caloriesBurned / calorieGoal) * 100, 100) : 0;

  // **Input Handlers**
  // Handle changes in the workout input form
  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  // Handle the submission of a new workout
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent adding future-dated workouts
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for a future date");
      return;
    }
    const timeSpent = calculateTimeDifference(newWorkout.startTime, newWorkout.endTime);
    // Add new workout to the state
    setWorkouts([...workouts, { ...newWorkout, timeSpent, id: Date.now() }]);
    // Reset the form fields
    setNewWorkout({ date: "", type: "", calories: "", startTime: "", endTime: "" });
  };

  // **Sorting Handlers**
  // Handle sorting logic by toggling direction or switching columns
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort filtered workouts based on selected column and direction
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortColumn === "calories") {
      return sortDirection === "asc"
        ? parseInt(a.calories) - parseInt(b.calories)
        : parseInt(b.calories) - parseInt(a.calories);
    }
    if (sortColumn === "timeSpent") {
      const aTime = parseInt(a.timeSpent.split("h")[0], 10);
      const bTime = parseInt(b.timeSpent.split("h")[0], 10);
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    }
    return 0;
  });

  // **UI Rendering**
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>

      {/* Metrics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Displaying total steps walked */}
        <Card>
          <CardHeader>
            <CardTitle>Steps Walked</CardTitle>
          </CardHeader>
          <CardContent>{stepsWalked}</CardContent>
        </Card>
        {/* Displaying total calories burned */}
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>{caloriesBurned} kCal</CardContent>
        </Card>
        {/* Displaying goal progress */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>{goalProgress.toFixed(2)}%</CardContent>
        </Card>
      </div>

      {/* Calorie Goal Input */}
      <div className="mb-4">
        <Input
          type="number"
          placeholder="Set Calorie Goal for the Week"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Add Workout Form */}
      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Date input */}
        <Input
          type="date"
          name="date"
          value={newWorkout.date}
          onChange={handleInputChange}
          required
        />
        {/* Workout type input */}
        <Input
          type="text"
          name="type"
          placeholder="Workout Type"
          value={newWorkout.type}
          onChange={handleInputChange}
          required
        />
        {/* Calories burned input */}
        <Input
          type="number"
          name="calories"
          placeholder="Calories Burned (kCal)"
          value={newWorkout.calories}
          onChange={handleInputChange}
          required
        />
        {/* Start time input */}
        <Input
          type="time"
          name="startTime"
          value={newWorkout.startTime}
          onChange={handleInputChange}
          required
        />
        {/* End time input */}
        <Input
          type="time"
          name="endTime"
          value={newWorkout.endTime}
          onChange={handleInputChange}
          required
        />
        <Button type="submit" className="col-span-full sm:col-span-1">Add Workout</Button>
      </form>

      {/* Filter */}
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

      {/* Workouts Table */}
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
            {/* Render sorted workouts in the table */}
            {sortedWorkouts.map((workout, index) => (
              <TableRow key={workout.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{workout.date}</TableCell>
                <TableCell>{workout.type}</TableCell>
                <TableCell>{workout.calories}</TableCell>
                <TableCell>{workout.timeSpent}</TableCell>
                <TableCell>{workout.startTime}</TableCell>
                <TableCell>{workout.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
