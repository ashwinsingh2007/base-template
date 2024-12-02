import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const dummyMeetings = [
  { id: 1, title: "Team Sync", date: new Date(2024, 11, 5, 10, 0), description: "Weekly team sync meeting" },
  { id: 2, title: "Client Call", date: new Date(2024, 11, 10, 14, 0), description: "Discussion with client about project progress" },
  { id: 3, title: "Product Demo", date: new Date(2024, 11, 15, 11, 0), description: "Showcase new features to stakeholders" },
  { id: 4, title: "Strategy Planning", date: new Date(2024, 11, 20, 9, 0), description: "Quarterly strategy planning session" },
  { id: 5, title: "Year-end Review", date: new Date(2024, 11, 30, 15, 0), description: "Annual performance review" },
];

export default function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [meetings, setMeetings] = useState(dummyMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", date: new Date(), description: "" });

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleAddMeeting = () => {
    setMeetings([...meetings, { ...newMeeting, id: meetings.length + 1 }]);
    setIsAddMeetingOpen(false);
    setNewMeeting({ title: "", date: new Date(), description: "" });
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
    setSelectedMeeting(null);
  };

  const renderCalendar = () => {
    return (
      <Calendar
        mode={view}
        selected={date}
        onSelect={handleDateChange}
        className="rounded-md border"
      />
    );
  };

  const renderMeetings = () => {
    const dayMeetings = meetings.filter(
      (meeting) => meeting.date.toDateString() === date.toDateString()
    );

    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Meetings for {date.toDateString()}</h2>
        {dayMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-2 mb-2 bg-gray-100 rounded cursor-pointer"
            onClick={() => setSelectedMeeting(meeting)}
          >
            <h3 className="font-medium">{meeting.title}</h3>
            <p className="text-sm text-gray-600">{meeting.date.toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar App</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <Button onClick={() => handleDateChange(new Date())}>Today</Button>
            <div>
              <Button onClick={() => handleViewChange("month")}>Month</Button>
              <Button onClick={() => handleViewChange("week")}>Week</Button>
            </div>
          </div>
          {renderCalendar()}
        </div>
        <div className="flex-1">
          {renderMeetings()}
          <Button className="mt-4" onClick={() => setIsAddMeetingOpen(true)}>
            Add Meeting
          </Button>
        </div>
      </div>

      <Dialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Meeting</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="datetime-local"
                value={newMeeting.date.toISOString().slice(0, 16)}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddMeeting}>Add Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Popover open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <PopoverContent className="w-80">
          {selectedMeeting && (
            <div>
              <h3 className="font-semibold">{selectedMeeting.title}</h3>
              <p className="text-sm text-gray-600">{selectedMeeting.date.toLocaleString()}</p>
              <p className="mt-2">{selectedMeeting.description}</p>
              <Button
                className="mt-4"
                variant="destructive"
                onClick={() => handleDeleteMeeting(selectedMeeting.id)}
              >
                Delete Meeting
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}