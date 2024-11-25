import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to calculate time difference
const calculateTimeDifference = (start, end) => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const diffMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
};

// Utility function to get the start and end dates for different filter options
const getDateRange = (filter) => {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  switch (filter) {
    case "This week":
      startDate.setDate(today.getDate() - today.getDay());
      break;
    case "Last week":
      startDate.setDate(today.getDate() - today.getDay() - 7);
      endDate.setDate(today.getDate() - today.getDay() - 1);
      break;
    case "This month":
      startDate.setDate(1);
      break;
    case "Last month":
      startDate.setMonth(today.getMonth() - 1, 1);
      endDate.setDate(0);
      break;
    case "Last 2 months":
      startDate.setMonth(today.getMonth() - 2, 1);
      break;
    case "Last 3 months":
      startDate.setMonth(today.getMonth() - 3, 1);
      break;
    default:
      break;
  }

  return { startDate, endDate };
};

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    date: "",
    type: "",
    calories: "",
    startTime: "",
    endTime: "",
  });
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [filter, setFilter] = useState("This week");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Calculate metrics
  const { startDate, endDate } = getDateRange(filter);
  const filteredWorkouts = workouts.filter(
    (workout) => new Date(workout.date) >= startDate && new Date(workout.date) <= endDate
  );

  const stepsWalked = filteredWorkouts.reduce((sum, workout) => sum + (workout.type === "Walking" ? 1000 : 0), 0);
  const caloriesBurned = filteredWorkouts.reduce((sum, workout) => sum + parseInt(workout.calories), 0);
  const goalProgress = calorieGoal > 0 ? Math.min((caloriesBurned / calorieGoal) * 100, 100) : 0;

  // Handle input changes
  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for a future date");
      return;
    }
    const timeSpent = calculateTimeDifference(newWorkout.startTime, newWorkout.endTime);
    setWorkouts([...workouts, { ...newWorkout, timeSpent, id: Date.now() }]);
    setNewWorkout({ date: "", type: "", calories: "", startTime: "", endTime: "" });
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort workouts
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
      const aTime = a.timeSpent.split("h")[0];
      const bTime = b.timeSpent.split("h")[0];
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Steps Walked</CardTitle>
          </CardHeader>
          <CardContent>{stepsWalked}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>{caloriesBurned} kCal</CardContent>
        </Card>
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
        <Input
          type="date"
          name="date"
          value={newWorkout.date}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="type"
          placeholder="Workout Type"
          value={newWorkout.type}
          onChange={handleInputChange}
          required
        />
        <Input
          type="number"
          name="calories"
          placeholder="Calories Burned (kCal)"
          value={newWorkout.calories}
          onChange={handleInputChange}
          required
        />
        <Input
          type="time"
          name="startTime"
          value={newWorkout.startTime}
          onChange={handleInputChange}
          required
        />
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