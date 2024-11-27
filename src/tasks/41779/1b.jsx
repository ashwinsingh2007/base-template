import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "Europe/London", label: "GMT" },
  { value: "Asia/Tokyo", label: "JST" },
];

function Clock({ is24Hour, timezone }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: !is24Hour,
    timeZone: timezone,
  }).format(time);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(time);

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold">{formattedTime}</h2>
      <p className="text-lg">{formattedDate}</p>
    </div>
  );
}

function AlarmForm({ onAddAlarm }) {
  const [alarmDateTime, setAlarmDateTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const alarmDate = new Date(alarmDateTime);
    if (alarmDate <= now) {
      alert("Cannot set alarm for past date and time");
      return;
    }
    onAddAlarm(alarmDate);
    setAlarmDateTime("");
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
    </form>
  );
}

function AlarmList({ alarms, onEditAlarm, onDeleteAlarm }) {
  return (
    <ul className="space-y-2">
      {alarms.map((alarm, index) => (
        <li key={index} className="flex items-center justify-between">
          <span>{alarm.toLocaleString()}</span>
          <div>
            <Button onClick={() => onEditAlarm(index)} className="mr-2">Edit</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the alarm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteAlarm(index)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
  const [editingAlarmIndex, setEditingAlarmIndex] = useState(null);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "";
  }, [isDarkMode]);

  const handleAddAlarm = (newAlarm) => {
    setAlarms([...alarms, newAlarm]);
  };

  const handleEditAlarm = (index) => {
    setEditingAlarmIndex(index);
  };

  const handleUpdateAlarm = (updatedAlarm) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[editingAlarmIndex] = updatedAlarm;
    setAlarms(updatedAlarms);
    setEditingAlarmIndex(null);
  };

  const handleDeleteAlarm = (index) => {
    const updatedAlarms = alarms.filter((_, i) => i !== index);
    setAlarms(updatedAlarms);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Digital Clock Widget</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock is24Hour={is24Hour} timezone={timezone} />
            <div className="mt-4 space-y-4">
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
          </CardContent>
        </Card>

        <Card className="w-full max-w-md mx-auto mt-4">
          <CardHeader>
            <CardTitle>Alarms</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="set">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="set">Set Alarm</TabsTrigger>
                <TabsTrigger value="view">View Alarms</TabsTrigger>
              </TabsList>
              <TabsContent value="set">
                <AlarmForm onAddAlarm={handleAddAlarm} />
              </TabsContent>
              <TabsContent value="view">
                <AlarmList
                  alarms={alarms}
                  onEditAlarm={handleEditAlarm}
                  onDeleteAlarm={handleDeleteAlarm}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {editingAlarmIndex !== null && (
          <Dialog open={true} onOpenChange={() => setEditingAlarmIndex(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Alarm</DialogTitle>
              </DialogHeader>
              <AlarmForm
                onAddAlarm={(updatedAlarm) => handleUpdateAlarm(updatedAlarm)}
              />
              <DialogFooter>
                <Button onClick={() => setEditingAlarmIndex(null)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}