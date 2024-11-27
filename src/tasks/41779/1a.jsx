import React, { useState, useEffect } from 'react';
import { Button, Switch, Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, isFuture, set } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const timeZones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'EST', value: 'America/New_York' },
  { label: 'PST', value: 'America/Los_Angeles' },
  { label: 'IST', value: 'Asia/Kolkata' },
];

function App() {
  const [time, setTime] = useState(new Date());
  const [format24, setFormat24] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [isDark, setIsDark] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const [currentAlarm, setCurrentAlarm] = useState({ date: new Date(), id: Date.now() });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFormat = () => setFormat24(!format24);
  const handleTimezoneChange = (value) => setTimezone(value);
  const toggleTheme = () => setIsDark(!isDark);

  const handleAlarmSubmit = () => {
    if (!isFuture(currentAlarm.date)) {
      alert('Cannot set alarm for a past time.');
      return;
    }
    const dayAlarms = alarms.filter(a => format(a.date, 'yyyy-MM-dd') === format(currentAlarm.date, 'yyyy-MM-dd'));
    if (dayAlarms.length >= 2) {
      alert('Only two alarms per day are allowed.');
      return;
    }
    setAlarms([...alarms, { ...currentAlarm }]);
    setShowAlarmDialog(false);
  };

  const deleteAlarm = (id) => {
    if (window.confirm('Are you sure you want to delete this alarm?')) {
      setAlarms(alarms.filter(a => a.id !== id));
    }
  };

  const timeFormat = format24 ? 'HH:mm:ss' : 'hh:mm:ss a';

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Card className="sm:w-96 w-full m-4">
        <CardHeader>
          <CardTitle>Digital Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl mb-4">{time.toLocaleTimeString('en-US', { timeZone: timezone, hour12: !format24, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <div>{format(time, 'EEEE, MMMM dd, yyyy', { timeZone: timezone })}</div>
          <div className="mt-4 space-x-2">
            <Switch checked={format24} onCheckedChange={toggleFormat}>24h</Switch>
            <Select value={timezone} onValueChange={handleTimezoneChange}>
              {timeZones.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
            </Select>
            <Switch checked={isDark} onCheckedChange={toggleTheme}>Dark</Switch>
          </div>
        </CardContent>
        <Tabs defaultValue="clock" className="w-full">
          <TabsList>
            <TabsTrigger value="clock">Clock</TabsTrigger>
            <TabsTrigger value="alarms">Alarms</TabsTrigger>
          </TabsList>
          <TabsContent value="alarms">
            <Button onClick={() => { setShowAlarmDialog(true); setCurrentAlarm({ date: new Date(), id: Date.now() }); }}>Add Alarm</Button>
            {alarms.map(alarm => (
              <div key={alarm.id} className="mt-2 flex justify-between items-center">
                <span>{format(alarm.date, timeFormat)}</span>
                <Button onClick={() => deleteAlarm(alarm.id)} variant="destructive">Delete</Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
      <Dialog open={showAlarmDialog} onOpenChange={setShowAlarmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Alarm</DialogTitle>
          </DialogHeader>
          <input 
            type="datetime-local" 
            value={format(currentAlarm.date, 'yyyy-MM-ddTHH:mm')} 
            onChange={(e) => setCurrentAlarm({...currentAlarm, date: new Date(e.target.value)})}
            className="w-full p-2 border rounded"
          />
          <DialogFooter>
            <Button type="submit" onClick={handleAlarmSubmit}>Set Alarm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;