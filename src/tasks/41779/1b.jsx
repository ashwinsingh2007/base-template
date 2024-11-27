import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "Asia/Kolkata", label: "IST" },
];

function Clock({ is24Hour, timezone }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: !is24Hour,
      timeZone: timezone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold">{formatTime(time)}</h2>
      <p className="text-lg">{formatDate(time)}</p>
    </div>
  );
}

function AlarmForm({ onAddAlarm, alarms }) {
  const [alarmDateTime, setAlarmDateTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const alarmDate = new Date(alarmDateTime);
    const today = new Date();

    if (alarmDate <= today) {
      setError("Cannot set alarm for past date/time");
      return;
    }

    const sameDay = alarms.filter(
      (alarm) => new Date(alarm.dateTime).toDateString() === alarmDate.toDateString()
    );

    if (sameDay.length >= 2) {
      setError("Cannot set more than 2 alarms for the same day");
      return;
    }

    onAddAlarm({ id: Date.now(), dateTime: alarmDateTime });
    setAlarmDateTime("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="datetime-local"
        value={alarmDateTime}
        onChange={(e) => setAlarmDateTime(e.target.value)}
        required
      />
      <Button type="submit">Set Alarm</Button>
      {error && <Alert variant="destructive">{error}</Alert>}
    </form>
  );
}

function AlarmList({ alarms, onDeleteAlarm, onEditAlarm }) {
  return (
    <ul className="space-y-2">
      {alarms.map((alarm) => (
        <li key={alarm.id} className="flex items-center justify-between">
          <span>{new Date(alarm.dateTime).toLocaleString()}</span>
          <div>
            <Button onClick={() => onEditAlarm(alarm)} className="mr-2">
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this alarm?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => onDeleteAlarm(alarm.id)}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [is24Hour, setIs24Hour] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const addAlarm = (newAlarm) => {
    setAlarms([...alarms, newAlarm]);
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const editAlarm = (editedAlarm) => {
    console.log("::::::::", editedAlarm)
    setAlarms(alarms.map((alarm) => (alarm.id === editedAlarm.id ? editedAlarm : alarm)));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Digital Clock Widget</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock is24Hour={is24Hour} timezone={timezone} />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>24-Hour Format</span>
                <Switch checked={is24Hour} onCheckedChange={setIs24Hour} />
              </div>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Tabs defaultValue="set-alarm" className="mt-4">
              <TabsList>
                <TabsTrigger value="set-alarm">Set Alarm</TabsTrigger>
                <TabsTrigger value="alarms">Alarms</TabsTrigger>
              </TabsList>
              <TabsContent value="set-alarm">
                <AlarmForm onAddAlarm={addAlarm} alarms={alarms} />
              </TabsContent>
              <TabsContent value="alarms">
                <AlarmList alarms={alarms} onDeleteAlarm={deleteAlarm} onEditAlarm={editAlarm} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}