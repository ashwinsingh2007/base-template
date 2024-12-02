import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// Dummy meetings data
const initialMeetings = [
  {
    id: 1,
    title: "Team Sync",
    description: "Weekly team sync meeting",
    date: new Date(2024, 11, 5, 10, 0),
  },
  {
    id: 2,
    title: "Project Review",
    description: "Monthly project review",
    date: new Date(2024, 11, 15, 14, 0),
  },
  {
    id: 3,
    title: "Client Call",
    description: "Important client call",
    date: new Date(2024, 11, 20, 11, 0),
  },
  {
    id: 4,
    title: "Training Session",
    description: "New feature training",
    date: new Date(2024, 11, 25, 13, 0),
  },
  {
    id: 5,
    title: "Year-end Review",
    description: "Annual performance review",
    date: new Date(2024, 11, 30, 9, 0),
  },
];

export default function App() {
  const [date, setDate] = useState(new Date());
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isWeekView, setIsWeekView] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: new Date(),
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const toggleView = () => {
    setIsWeekView(!isWeekView);
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleAddMeeting = () => {
    setMeetings([...meetings, { ...newMeeting, id: meetings.length + 1 }]);
    setNewMeeting({ title: "", description: "", date: new Date() });
    setShowMeetingModal(false);
  };

  const handleEditMeeting = () => {
    const updatedMeetings = meetings.map((m) =>
      m.id === selectedMeeting.id ? selectedMeeting : m
    );
    setMeetings(updatedMeetings);
    setShowMeetingModal(false);
  };

  const handleDeleteMeeting = () => {
    const updatedMeetings = meetings.filter((m) => m.id !== selectedMeeting.id);
    setMeetings(updatedMeetings);
    setShowMeetingModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Meeting Calendar</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <Button onClick={handlePrevious}>Previous</Button>
          <Button onClick={handleNext}>Next</Button>
          <Button onClick={handleToday}>Today</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={toggleView}>
            {isWeekView ? "Month View" : "Week View"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Meeting</Button>
            </DialogTrigger>
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
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        description: e.target.value,
                      })
                    }
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
                    value={newMeeting.date.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        date: new Date(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMeeting}>Add Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Calendar
        mode={isWeekView ? "week" : "month"}
        selected={date}
        onSelect={handleDateChange}
        className="rounded-md border"
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Meetings</h2>
        {meetings
          .filter(
            (meeting) =>
              meeting.date.getMonth() === date.getMonth() &&
              meeting.date.getFullYear() === date.getFullYear()
          )
          .map((meeting) => (
            <div
              key={meeting.id}
              className="bg-gray-100 p-2 mb-2 rounded cursor-pointer"
              onClick={() => handleMeetingClick(meeting)}
            >
              <h3 className="font-semibold">{meeting.title}</h3>
              <p>{meeting.date.toLocaleString()}</p>
            </div>
          ))}
      </div>
      {showMeetingModal && selectedMeeting && (
        <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMeeting.title}</DialogTitle>
              <DialogDescription>
                {selectedMeeting.date.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>{selectedMeeting.description}</p>
            </div>
            <DialogFooter>
              <Button onClick={handleEditMeeting}>Edit</Button>
              <Button onClick={handleDeleteMeeting} variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}