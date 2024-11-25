import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Input, 
  Button, 
  Select, 
  SelectItem 
} from "@/components/ui/input";

const initialData = [
  { id: 1, date: '2023-05-01', workout: 'Running', calories: 300, start: '07:00', end: '08:00' },
  { id: 2, date: '2023-05-02', workout: 'Yoga', calories: 150, start: '18:00', end: '19:00' },
];

function formatTime(start, end) {
  const diff = (new Date(`1970-01-01T${end}:00`) - new Date(`1970-01-01T${start}:00`)) / 1000 / 60;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

export default function App() {
  const [workouts, setWorkouts] = useState(initialData);
  const [form, setForm] = useState({ date: '', workout: '', calories: '', start: '', end: '' });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState('thisWeek');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const addWorkout = () => {
    if (new Date(form.date) > new Date()) {
      alert('Cannot add workout for a future date!');
      return;
    }
    const newWorkout = { 
      id: Date.now(), 
      ...form, 
      calories: parseInt(form.calories, 10) || 0,
    };
    setWorkouts([...workouts, newWorkout]);
    setForm({ date: '', workout: '', calories: '', start: '', end: '' });
  };

  const filteredWorkouts = useMemo(() => {
    let result = [...workouts];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch(filter) {
      case 'thisWeek': 
        result = result.filter(w => new Date(w.date) >= startOfWeek); 
        break;
      case 'lastWeek': 
        const lastWeekStart = new Date(startOfWeek);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        result = result.filter(w => new Date(w.date) >= lastWeekStart && new Date(w.date) < startOfWeek);
        break;
      case 'thisMonth': 
        result = result.filter(w => new Date(w.date) >= startOfMonth); 
        break;
      case 'lastMonth': 
        const lastMonth = new Date(startOfMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        result = result.filter(w => new Date(w.date) >= lastMonth && new Date(w.date) < startOfMonth);
        break;
      case 'last2Months':
        const twoMonthsAgo = new Date(startOfMonth);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        result = result.filter(w => new Date(w.date) >= twoMonthsAgo);
        break;
      case 'last3Months':
        const threeMonthsAgo = new Date(startOfMonth);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        result = result.filter(w => new Date(w.date) >= threeMonthsAgo);
        break;
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [workouts, filter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const stepsThisWeek = 10000; // Placeholder value for steps
  const caloriesBurnedThisWeek = filteredWorkouts.reduce((acc, w) => acc + w.calories, 0);
  const goalProgress = (caloriesBurnedThisWeek / calorieGoal) * 100;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Fitness Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>Steps walked this week: {stepsThisWeek}</div>
            <div>Calories burned this week: {caloriesBurnedThisWeek} kCal</div>
            <div>Goal progress: {goalProgress.toFixed(2)}%</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({...form, date: e.target.value})} 
              placeholder="Date" 
            />
            <Input 
              value={form.workout} 
              onChange={(e) => setForm({...form, workout: e.target.value})} 
              placeholder="Workout Type" 
            />
            <Input 
              type="number" 
              value={form.calories} 
              onChange={(e) => setForm({...form, calories: e.target.value})} 
              placeholder="Calories Burned" 
            />
            <Input 
              type="time" 
              value={form.start} 
              onChange={(e) => setForm({...form, start: e.target.value})} 
              placeholder="Start Time" 
            />
            <Input 
              type="time" 
              value={form.end} 
              onChange={(e) => setForm({...form, end: e.target.value})} 
              placeholder="End Time" 
            />
            <Button onClick={addWorkout}>Add Workout</Button>
          </div>
          <div className="mb-4">
            <label>Calorie Goal for this Week: </label>
            <Input 
              type="number" 
              value={calorieGoal} 
              onChange={(e) => setCalorieGoal(Number(e.target.value))} 
              className="w-40"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="last2Months">Last 2 Months</SelectItem>
            <SelectItem value="last3Months">Last 3 Months</SelectItem>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SNo.</TableHead>
                <TableHead onClick={() => requestSort('date')}>Date</TableHead>
                <TableHead onClick={() => requestSort('workout')}>Workout Type</TableHead>
                <TableHead onClick={() => requestSort('calories')}>Calories Burnt (kCal)</TableHead>
                <TableHead onClick={() => requestSort('timeSpent')}>Time Spent</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkouts.map((workout, index) => (
                <TableRow key={workout.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{workout.date}</TableCell>
                  <TableCell>{workout.workout}</TableCell>
                  <TableCell>{workout.calories}</TableCell>
                  <TableCell>{formatTime(workout.start, workout.end)}</TableCell>
                  <TableCell>{workout.start}</TableCell>
                  <TableCell>{workout.end}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}