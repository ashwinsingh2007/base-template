import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui";

// Sample data
const sampleData = Array.from({length: 20}, (_, i) => ({
  id: i + 1,
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  workoutType: ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weight Training'][Math.floor(Math.random() * 5)],
  caloriesBurnt: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
  startTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  endTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
}));

function App() {
  const [data, setData] = useState(sampleData);
  const [form, setForm] = useState({date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: ''});
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [filter, setFilter] = useState('thisWeek');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const addWorkout = () => {
    if (new Date(form.date) > new Date()) {
      alert("Cannot add workout for a future date!");
      return;
    }
    const newItem = {
      ...form,
      id: data.length + 1,
      caloriesBurnt: parseInt(form.caloriesBurnt, 10),
    };
    setData(prev => [...prev, newItem]);
    setForm({date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: ''});
  };

  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch(filter) {
      case 'thisWeek':
        filtered = filtered.filter(d => new Date(d.date) >= startOfWeek);
        break;
      case 'lastWeek':
        const lastWeekStart = new Date(startOfWeek);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        filtered = filtered.filter(d => new Date(d.date) >= lastWeekStart && new Date(d.date) < startOfWeek);
        break;
      case 'thisMonth':
        filtered = filtered.filter(d => new Date(d.date) >= startOfMonth);
        break;
      case 'lastMonth':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filtered = filtered.filter(d => new Date(d.date) >= new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1) && new Date(d.date) < startOfMonth);
        break;
      case 'last2Months':
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        filtered = filtered.filter(d => new Date(d.date) >= twoMonthsAgo);
        break;
      case 'last3Months':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filtered = filtered.filter(d => new Date(d.date) >= threeMonthsAgo);
        break;
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, filter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const calculateTimeSpent = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let hours = endH - startH;
    let minutes = endM - startM;
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    return `${hours}h ${minutes}m`;
  };

  const metrics = {
    stepsThisWeek: filteredData.length * 1000, // Assuming 1000 steps per workout
    caloriesBurnedThisWeek: filteredData.reduce((sum, item) => sum + item.caloriesBurnt, 0),
    goalProgress: Math.min((filteredData.reduce((sum, item) => sum + item.caloriesBurnt, 0) / calorieGoal) * 100, 100)
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Fitness Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p>Steps walked this week</p>
              <p className="text-2xl font-bold">{metrics.stepsThisWeek}</p>
            </div>
            <div className="text-center">
              <p>Calories burned this week</p>
              <p className="text-2xl font-bold">{metrics.caloriesBurnedThisWeek} kCal</p>
            </div>
            <div className="text-center">
              <p>Goal Progress</p>
              <p className="text-2xl font-bold">{metrics.goalProgress.toFixed(2)}%</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input 
              type="number" 
              placeholder="Weekly Calorie Goal" 
              value={calorieGoal} 
              onChange={(e) => setCalorieGoal(Number(e.target.value))} 
            />
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="last2Months">Last 2 Months</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('id')}>SNo.</TableHead>
                <TableHead onClick={() => requestSort('date')}>Date</TableHead>
                <TableHead onClick={() => requestSort('workoutType')}>Workout Type</TableHead>
                <TableHead onClick={() => requestSort('caloriesBurnt')}>Calories Burnt (kCal)</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.workoutType}</TableCell>
                  <TableCell>{item.caloriesBurnt}</TableCell>
                  <TableCell>{calculateTimeSpent(item.startTime, item.endTime)}</TableCell>
                  <TableCell>{item.startTime}</TableCell>
                  <TableCell>{item.endTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} placeholder="Date" />
          <Input value={form.workoutType} onChange={(e) => setForm({...form, workoutType: e.target.value})} placeholder="Workout Type" />
          <Input type="number" value={form.caloriesBurnt} onChange={(e) => setForm({...form, caloriesBurnt: e.target.value})} placeholder="Calories Burnt" />
          <Input type="time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} placeholder="Start Time" />
          <Input type="time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} placeholder="End Time" />
          <Button onClick={addWorkout}>Add Workout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;