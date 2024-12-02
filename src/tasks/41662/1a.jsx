import React, { useState, useMemo } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Input, Select, SelectItem, Label,
} from "@/components/ui";
import { format, addDays, isFuture, parseISO } from 'date-fns';

const initialData = Array.from({ length: 20 }, (_, i) => ({
  date: format(addDays(new Date(), -i), 'yyyy-MM-dd'),
  workoutType: ['Running', 'Cycling', 'Swimming', 'Yoga'][i % 4],
  caloriesBurnt: Math.floor(Math.random() * (500 - 200 + 1)) + 200,
  startTime: '08:00',
  endTime: '09:00',
}));

export default function App() {
  const [entries, setEntries] = useState(initialData);
  const [newEntry, setNewEntry] = useState({ date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: '' });
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [filter, setFilter] = useState('thisWeek');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];
    const now = new Date();
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastWeekStart = addDays(thisWeekStart, -7);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    switch(filter) {
      case 'thisWeek': filtered = filtered.filter(e => new Date(e.date) >= thisWeekStart); break;
      case 'lastWeek': filtered = filtered.filter(e => new Date(e.date) >= lastWeekStart && new Date(e.date) < thisWeekStart); break;
      case 'thisMonth': filtered = filtered.filter(e => new Date(e.date) >= thisMonthStart); break;
      case 'lastMonth': filtered = filtered.filter(e => new Date(e.date) >= lastMonthStart && new Date(e.date) < thisMonthStart); break;
      case 'last2Months': filtered = filtered.filter(e => new Date(e.date) >= addMonths(lastMonthStart, -1)); break;
      case 'last3Months': filtered = filtered.filter(e => new Date(e.date) >= addMonths(lastMonthStart, -2)); break;
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [entries, filter, sortConfig]);

  const caloriesBurnedThisWeek = useMemo(() => 
    filteredEntries.reduce((sum, entry) => sum + entry.caloriesBurnt, 0), 
    [filteredEntries]
  );

  const addEntry = () => {
    if (isFuture(parseISO(newEntry.date))) return;
    setEntries([...entries, { 
      ...newEntry, 
      timeSpent: `${(new Date(`1970-01-01T${newEntry.endTime}:00`) - new Date(`1970-01-01T${newEntry.startTime}:00`)) / 3600000} hours`
    }]);
    setNewEntry({ date: '', workoutType: '', caloriesBurnt: '', startTime: '', endTime: '' });
  };

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fitness Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>Calories burned this week: {caloriesBurnedThisWeek} kCal</div>
            <div>
              <Label>Weekly Calorie Goal:</Label>
              <Input 
                type="number" 
                value={calorieGoal} 
                onChange={(e) => setCalorieGoal(Number(e.target.value))} 
                className="w-24 ml-2"
              />
            </div>
            <div>Goal Progress: {((caloriesBurnedThisWeek / calorieGoal) * 100).toFixed(2)}%</div>
          </div>
          <div className="mb-4">
            <Label>Filter:</Label>
            <Select onValueChange={setFilter}>
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
                <TableHead>SNo.</TableHead>
                <TableHead onClick={() => requestSort('date')}>Date</TableHead>
                <TableHead onClick={() => requestSort('workoutType')}>Workout</TableHead>
                <TableHead onClick={() => requestSort('caloriesBurnt')}>Calories (kCal)</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.workoutType}</TableCell>
                  <TableCell>{entry.caloriesBurnt}</TableCell>
                  <TableCell>{entry.timeSpent}</TableCell>
                  <TableCell>{entry.startTime}</TableCell>
                  <TableCell>{entry.endTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
          <Input type="text" placeholder="Workout Type" value={newEntry.workoutType} onChange={e => setNewEntry({...newEntry, workoutType: e.target.value})} />
          <Input type="number" placeholder="Calories Burnt" value={newEntry.caloriesBurnt} onChange={e => setNewEntry({...newEntry, caloriesBurnt: e.target.value})} />
          <Input type="time" value={newEntry.startTime} onChange={e => setNewEntry({...newEntry, startTime: e.target.value})} />
          <Input type="time" value={newEntry.endTime} onChange={e => setNewEntry({...newEntry, endTime: e.target.value})} />
          <Button onClick={addEntry} disabled={isFuture(parseISO(newEntry.date))}>Add Entry</Button>
        </CardContent>
      </Card>
    </div>
  );
}