import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy meeting data
const dummyMeetings = [
  { id: 1, title: "Team Standup", date: "2024-11-10", time: "09:00", description: "Daily team standup meeting" },
  { id: 2, title: "Project Review", date: "2024-10-12", time: "14:00", description: "Monthly project review" },
  { id: 3, title: "Client Call", date: "2024-11-15", time: "11:00", description: "Important client call" },
  { id: 4, title: "Training Session", date: "2024-11-18", time: "13:00", description: "New tool training" },
  { id: 5, title: "Strategy Meeting", date: "2024-11-20", time: "10:00", description: "Quarterly strategy meeting" },
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState(dummyMeetings);
  const [viewMode, setViewMode] = useState("month");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const today = new Date();

    if (viewMode === "month") {
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const isToday = date.toDateString() === today.toDateString();
        const dayMeetings = meetings.filter(m => new Date(m.date).toDateString() === date.toDateString());

        days.push(
          <div key={i} className={`p-2 border ${isToday ? "bg-blue-100" : ""}`}>
            <div className="font-bold">{i}</div>
            {dayMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="bg-green-200 p-1 my-1 cursor-pointer text-sm"
                onClick={() => handleMeetingClick(meeting)}
              >
                {meeting.title}
              </div>
            ))}
          </div>
        );
      }
    } else if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const isToday = date.toDateString() === today.toDateString();
        const dayMeetings = meetings.filter(m => new Date(m.date).toDateString() === date.toDateString());

        days.push(
          <div key={i} className={`p-2 border ${isToday ? "bg-blue-100" : ""}`}>
            <div className="font-bold">{date.getDate()}</div>
            {dayMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="bg-green-200 p-1 my-1 cursor-pointer text-sm"
                onClick={() => handleMeetingClick(meeting)}
              >
                {meeting.title}
              </div>
            ))}
          </div>
        );
      }
    }

    return days;
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleAddMeeting = () => {
    setSelectedMeeting({ id: Date.now(), title: "", date: "", time: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleSaveMeeting = () => {
    if (selectedMeeting.id) {
      setMeetings(meetings.map(m => m.id === selectedMeeting.id ? selectedMeeting : m));
    } else {
      setMeetings([...meetings, { ...selectedMeeting, id: Date.now() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteMeeting = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteMeeting = () => {
    setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
    setIsDialogOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar App</h1>
      <div className="flex justify-between mb-4">
        <div>
          <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            Previous
          </Button>
          <Button onClick={() => setCurrentDate(new Date())} className="ml-2">
            Today
          </Button>
          <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="ml-2">
            Next
          </Button>
        </div>
        <div>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid ${viewMode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleAddMeeting} className="mt-4">
        Add Meeting
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.id ? "Edit Meeting" : "Add Meeting"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={selectedMeeting?.title || ""}
                onChange={(e) => setSelectedMeeting({ ...selectedMeeting, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedMeeting?.date || ""}
                onChange={(e) => setSelectedMeeting({ ...selectedMeeting, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedMeeting?.time || ""}
                onChange={(e) => setSelectedMeeting({ ...selectedMeeting, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={selectedMeeting?.description || ""}
                onChange={(e) => setSelectedMeeting({ ...selectedMeeting, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {selectedMeeting?.id && (
              <Button variant="destructive" onClick={handleDeleteMeeting}>
                Delete
              </Button>
            )}
            <Button onClick={handleSaveMeeting}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this meeting?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMeeting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}