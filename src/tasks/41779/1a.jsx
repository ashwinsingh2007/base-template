import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format, add, isFuture, isPast } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// List of timezones for the selector
const timeZones = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo'
];

function Clock({ timezone, format24 }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const zonedTime = utcToZonedTime(time, timezone);
  const displayTime = format(zonedTime, format24 ? 'HH:mm:ss' : 'hh:mm:ss a');

  return (
    <div className="text-4xl font-mono">
      {displayTime}
    </div>
  );
}

function DateDisplay({ timezone }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const dateTimer = setInterval(() => {
      setDate(new Date());
    }, 60000); // Update every minute for the date
    return () => clearInterval(dateTimer);
  }, []);

  const zonedDate = utcToZonedTime(date, timezone);
  return (
    <div className="mt-2 text-sm">
      {format(zonedDate, 'EEEE, MMMM dd, yyyy')}
    </div>
  );
}

function Alarm({ alarm, onDelete, onEdit }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <Card className="mb-2">
      <CardContent>
        <p>{format(new Date(alarm.date), 'hh:mm a, EEEE, MMMM dd, yyyy')}</p>
        <Button onClick={() => setIsConfirmingDelete(true)} variant="destructive" size="sm">Delete</Button>
        <Button onClick={onEdit} className="ml-2" size="sm">Edit</Button>
      </CardContent>
      {isConfirmingDelete && (
        <div className="p-4 bg-background border-t border-border">
          <p>Are you sure?</p>
          <Button onClick={() => onDelete(alarm.id)} className="mt-2">Confirm Delete</Button>
        </div>
      )}
    </Card>
  );
}

export default function App() {
  const [format24, setFormat24] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [theme, setTheme] = useState('light');
  const [alarms, setAlarms] = useState([]);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmDate, setAlarmDate] = useState('');

  const addAlarm = useCallback(() => {
    const alarmDateTime = new Date(`${alarmDate}T${alarmTime}`);
    if (isPast(alarmDateTime)) {
      alert("Cannot set alarm for past time.");
      return;
    }
    const newAlarm = {
      id: Date.now(),
      date: alarmDateTime.toISOString(),
    };
    setAlarms(prev => [...prev, newAlarm]);
    setAlarmTime('');
    setAlarmDate('');
  }, [alarmDate, alarmTime]);

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className={`min-h-screen p-4 ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'} sm:p-8`}>
      <Card>
        <CardHeader>
          <CardTitle>Digital Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <Clock timezone={timezone} format24={format24} />
          <DateDisplay timezone={timezone} />
          <div className="flex items-center justify-between mt-4">
            <Switch checked={format24} onCheckedChange={setFormat24} /> 
            <span>{format24 ? '24-hour' : '12-hour'}</span>
          </div>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-[180px] mt-2">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="mt-4 flex items-center">
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            <span className="ml-2">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="set" className="mt-4">
        <TabsList>
          <TabsTrigger value="set">Set Alarm</TabsTrigger>
          <TabsTrigger value="view">View Alarms</TabsTrigger>
        </TabsList>
        <TabsContent value="set">
          <Input 
            type="time" 
            value={alarmTime} 
            onChange={e => setAlarmTime(e.target.value)} 
            className="mt-2"
          />
          <Input 
            type="date" 
            value={alarmDate} 
            onChange={e => setAlarmDate(e.target.value)} 
            className="mt-2"
          />
          <Button onClick={addAlarm} className="mt-2">Add Alarm</Button>
        </TabsContent>
        <TabsContent value="view">
          {alarms.map(alarm => (
            <Alarm 
              key={alarm.id} 
              alarm={alarm} 
              onDelete={deleteAlarm} 
              onEdit={() => alert('Edit functionality to be implemented')} // Placeholder for edit functionality
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}