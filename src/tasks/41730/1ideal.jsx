import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

function App() {
  // **State Definitions**
  const [currentDate, setCurrentDate] = useState(new Date()); // Holds the current date for the calendar.
  const [view, setView] = useState("month"); // Holds the current calendar view: 'month' or 'week'.
  const [meetings, setMeetings] = useState(initialMeetings); // Array of meeting objects (title, description, date, time).
  const [selectedMeeting, setSelectedMeeting] = useState(null); // Holds the currently selected meeting (for edit/delete).
  const [isModalOpen, setIsModalOpen] = useState(false); // Boolean to control the Add/Edit modal visibility.
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Boolean to control the Delete Confirmation modal.
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
  }); // Holds the form data for adding/editing meetings.

  // **Calendar Days (Month View)**
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // **Calendar Days (Week View)**
  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  // **Function to handle date navigation**
  function handleDateChange(date) {
    setCurrentDate(date); // Updates the `currentDate`.
    if (view === "week") {
      setCurrentDate(startOfWeek(date)); // In week view, start from the beginning of the week.
    }
  }

  // **Function to open Add Meeting modal**
  function openModalForAdd() {
    setForm({ ...form, date: currentDate }); // Prepopulate the form's date with the currently selected date.
    setIsModalOpen(true); // Open the modal.
  }

  // **Function to open Edit Meeting modal**
  function openModalForEdit(meeting) {
    setSelectedMeeting(meeting); // Store the selected meeting to edit.
    setForm({
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      time: meeting.time,
    }); // Populate the form with the meeting's data.
    setIsModalOpen(true); // Open the modal.
  }

  // **Function to handle form submission (Add/Edit meeting)**
  function handleSubmit(e) {
    e.preventDefault(); // Prevent the form from reloading the page.
    const newMeeting = { ...form, date: new Date(form.date) }; // Ensure the date is stored as a `Date` object.
    if (selectedMeeting) {
      // If editing, replace the meeting in the `meetings` array.
      setMeetings(
        meetings.map((m) => (m === selectedMeeting ? newMeeting : m))
      );
    } else {
      // If adding, append the new meeting to the array.
      setMeetings([...meetings, newMeeting]);
    }
    setIsModalOpen(false); // Close the modal.
  }

  // **Function to confirm deletion of a meeting**
  function confirmDeleteMeeting() {
    setMeetings(meetings.filter((m) => m !== selectedMeeting)); // Remove the selected meeting from the array.
    setSelectedMeeting(null); // Clear the selected meeting.
    setIsDeleteConfirmationOpen(false); // Close the confirmation modal.
  }

  return (
    <div className="p-6 sm:p-12">
      {/* Date Navigation Controls */}
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => handleDateChange(subMonths(currentDate, 1))}>
          Previous
        </Button>
        <Button onClick={() => handleDateChange(new Date())}>Today</Button>
        <Button onClick={() => handleDateChange(addMonths(currentDate, 1))}>
          Next
        </Button>
      </div>

      {/* Toggle Calendar View */}
      <Button
        onClick={() => setView(view === "month" ? "week" : "month")}
        className="mb-6"
      >
        {view === "month" ? "Week View" : "Month View"}
      </Button>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {(view === "month" ? daysInMonth : daysInWeek).map((day) => (
          <Card key={day.toISOString()} className="min-h-[120px]">
            <CardHeader className="p-3">
              {/* Highlight Today's Date */}
              <CardTitle
                className={`${isSameDay(day, new Date()) ? "text-blue-600" : ""
                  }`}
              >
                {format(day, "d")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-sm">
              {/* Render Meetings for Each Day */}
              {meetings
                .filter((meeting) => isSameDay(meeting.date, day))
                .map((meeting) => (
                  <div
                    key={meeting.title}
                    onClick={() => openModalForEdit(meeting)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    {meeting.time} - {meeting.title}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Meeting Button */}
      <Button onClick={openModalForAdd} className="mt-6">
        Add Meeting
      </Button>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMeeting ? "Edit Meeting" : "Add Meeting"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              required
            />
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
            />
            <Input
              type="date"
              value={format(form.date, "yyyy-MM-dd")}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
              {selectedMeeting && (
                <Button
                  type="button"
                  onClick={() => setIsDeleteConfirmationOpen(true)}
                  className="ml-2 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this meeting?</p>
          <DialogFooter>
            <Button onClick={confirmDeleteMeeting} className="bg-red-500">
              Yes, Delete
            </Button>
            <Button onClick={() => setIsDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// **Initial Meetings**
const initialMeetings = [
  {
    title: "Morning Standup",
    description: "Daily team sync",
    date: new Date(),
    time: "09:00",
  },
  {
    title: "Client Call",
    description: "Discuss project progress",
    date: new Date(),
    time: "14:30",
  },
  {
    title: "Lunch Break",
    description: "",
    date: new Date(),
    time: "12:00",
  },
  {
    title: "Code Review",
    description: "Review pull requests",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "16:00",
  },
  {
    title: "Gym Session",
    description: "Cardio and weights",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "18:00",
  },
];

export default App;
