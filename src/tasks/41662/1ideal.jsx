import React, { useState } from "react"; // Importing React and useState hook for managing state
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // UI components for displaying information in card format
import { Button } from "@/components/ui/button"; // Button component for actions
import { Input } from "@/components/ui/input"; // Input component for user inputs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Select dropdown components for filtering
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components for displaying data
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Dialog components for modal-like interactions

// Sample workout data for initial state
const sampleData = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(2024, 11, i + 1); // Generating dates for December 2024
  const type = i % 2 === 0 ? "Running" : "Cycling"; // Alternating workout types between Running and Cycling
  const calories = Math.floor(Math.random() * 500) + 100; // Random calories between 100 and 600
  const startHour = Math.floor(Math.random() * 12) + 6; // Random start hour between 6 and 18
  const endHour = startHour + 1; // End hour is one hour after start
  const start = `${startHour.toString().padStart(2, "0")}:00`; // Formatting start time
  const end = `${endHour.toString().padStart(2, "0")}:30`; // Formatting end time

  return {
    date: date.toISOString().split("T")[0], // ISO format date, keeping only the date part
    type, // Workout type
    calories, // Calories burned
    start, // Start time
    end, // End time
  };
});

export default function App() {
  const [workouts, setWorkouts] = useState(sampleData);
  const [newWorkout, setNewWorkout] = useState({ date: "", type: "", calories: "", start: "", end: "" });
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default calorie goal
  const [filter, setFilter] = useState("Last 3 months"); // Default filter
  const [sortBy, setSortBy] = useState(null); // Sorting criteria
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order (ascending or descending)
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  const itemsPerPage = 5; // Number of items displayed per page

  const caloriesThisWeek = workouts.reduce((sum, w) => sum + Number(w.calories), 0);
  const goalProgress = Math.min((caloriesThisWeek / calorieGoal) * 100, 100).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(newWorkout.date) > new Date()) {
      alert("Cannot add workout for future date");
      return;
    }
    setWorkouts([...workouts, { ...newWorkout, calories: Number(newWorkout.calories) }]);
    setNewWorkout({ date: "", type: "", calories: "", start: "", end: "" });
  };

  const handleChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const filterWorkouts = () => workouts;
  const sortWorkouts = (workouts) => workouts;
  const filteredAndSortedWorkouts = sortWorkouts(filterWorkouts());

  const totalPages = Math.ceil(filteredAndSortedWorkouts.length / itemsPerPage);
  const paginatedWorkouts = filteredAndSortedWorkouts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center">🏋️‍♂️ Fitness Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Card className="bg-sky-400 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Calories Burned This Week</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{caloriesThisWeek} kCal</CardContent>
        </Card>
        <Card className="bg-sky-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{goalProgress}%</CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Input
          type="number"
          placeholder="Set Weekly Calorie Goal"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(Number(e.target.value))}
          className="w-full sm:w-auto bg-white text-black shadow-lg"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-white hover:bg-gray-200 border text-black shadow-lg">
              Add New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-sky-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add New Workout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="date" name="date" value={newWorkout.date} onChange={handleChange} required className="bg-white text-black" />
              <Input type="text" name="type" placeholder="Workout Type" value={newWorkout.type} onChange={handleChange} required className="bg-white text-black" />
              <Input type="number" name="calories" placeholder="Calories Burned" value={newWorkout.calories} onChange={handleChange} required className="bg-white text-black" />
              <Input type="time" name="start" value={newWorkout.start} onChange={handleChange} required className="bg-white text-black" />
              <Input type="time" name="end" value={newWorkout.end} onChange={handleChange} required className="bg-white text-black" />
              <DialogFooter>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  Add Workout
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Select value={filter} onValueChange={setFilter} className="mb-6">
        <SelectTrigger className="w-full sm:w-56 bg-white text-black">
          <SelectValue placeholder="Filter Workouts" />
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

      <div className="overflow-x-auto bg-purple-200 rounded-lg shadow-lg p-4 mt-5">
        <Table className="table-auto">
          <TableHeader>
            <TableRow className="text-white bg-purple-900">
              <TableHead>S.No.</TableHead>
              <TableHead onClick={() => setSortBy("date")} className="cursor-pointer">
                Date
              </TableHead>
              <TableHead>Workout Type</TableHead>
              <TableHead onClick={() => setSortBy("calories")} className="cursor-pointer">
                Calories Burned
              </TableHead>
              <TableHead onClick={() => setSortBy("timeSpent")} className="cursor-pointer">
                Time Spent
              </TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWorkouts.map((workout, index) => (
              <TableRow key={index} className="hover:bg-purple-700 text-black">
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
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

      <div className="flex justify-between items-center mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Previous
        </Button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
