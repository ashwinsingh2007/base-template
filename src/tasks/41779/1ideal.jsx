import React, { useState, useEffect } from "react";
// Importing UI components from a custom UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Predefined timezone options
const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "Asia/Kolkata", label: "IST" },
];

// Clock component to display the current time and date
function Clock({ is24Hour, timezone }) {
  const [time, setTime] = useState(new Date()); // State for current time

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Clean up the timer when the component unmounts
  }, []);

  // Formats time based on the selected format (12-hour or 24-hour) and timezone
  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: !is24Hour, // Toggle between 12-hour and 24-hour format
      timeZone: timezone,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Formats date based on the selected timezone
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

// AlarmForm component to add new alarms
function AlarmForm({ onAddAlarm, alarms }) {
  const [alarmDateTime, setAlarmDateTime] = useState(""); // State for alarm date and time input
  const [error, setError] = useState(""); // State to handle error messages

  // Handles form submission to add a new alarm
  const handleSubmit = (e) => {
    e.preventDefault();
    const alarmDate = new Date(alarmDateTime);
    const today = new Date();

    if (alarmDate <= today) {
      setError("Cannot set alarm for past date/time");
      return;
    }

    // Ensure no more than 2 alarms are set for the same day
    const sameDay = alarms.filter(
      (alarm) => new Date(alarm.dateTime).toDateString() === alarmDate.toDateString()
    );
    if (sameDay.length >= 2) {
      setError("Cannot set more than 2 alarms for the same day");
      return;
    }

    onAddAlarm({ id: Date.now(), dateTime: alarmDateTime }); // Add the alarm
    setAlarmDateTime(""); // Reset the input
    setError(""); // Clear the error
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

// AlarmList component to display and manage alarms
function AlarmList({ alarms, onDeleteAlarm, onEditAlarm }) {
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [currentAlarm, setCurrentAlarm] = useState(null); // State to hold the alarm being edited
  const [newDateTime, setNewDateTime] = useState(""); // State to hold new date-time during edit

  // Handles alarm editing submission
  const handleEditSubmit = () => {
    if (new Date(newDateTime) <= new Date()) {
      alert("Cannot set alarm for past date/time");
      return;
    }
    onEditAlarm({ ...currentAlarm, dateTime: newDateTime }); // Update the alarm
    setIsEditing(false);
    setCurrentAlarm(null);
    setNewDateTime(""); // Reset the input
  };

  return (
    <ul className="space-y-2">
      {alarms.map((alarm) => (
        <li key={alarm.id} className="flex items-center justify-between">
          <span>{new Date(alarm.dateTime).toLocaleString()}</span>
          <div>
            {/* Edit button */}
            <Button
              onClick={() => {
                setIsEditing(true);
                setCurrentAlarm(alarm);
                setNewDateTime(alarm.dateTime);
              }}
              className="mr-2"
            >
              Edit
            </Button>
            {/* Delete dialog */}
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
      {/* Edit alarm dialog */}
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Alarm</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                required
              />
            </DialogDescription>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ul>
  );
}

// Main App component
export default function App() {
  const [is24Hour, setIs24Hour] = useState(false); // State for 24-hour format toggle
  const [timezone, setTimezone] = useState("UTC"); // State for selected timezone
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode toggle
  const [alarms, setAlarms] = useState([]); // State to hold list of alarms

  // Function to add a new alarm
  const addAlarm = (newAlarm) => {
    setAlarms([...alarms, newAlarm]);
  };

  // Function to delete an alarm by ID
  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  // Function to edit an alarm
  const editAlarm = (editedAlarm) => {
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
              {/* Toggle 24-hour format */}
              <div className="flex items-center justify-between">
                <span>24-Hour Format</span>
                <Switch checked={is24Hour} onCheckedChange={setIs24Hour} />
              </div>
              {/* Toggle dark mode */}
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              {/* Timezone selection */}
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
              {/* Tabs for setting alarms and viewing alarm list */}
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
