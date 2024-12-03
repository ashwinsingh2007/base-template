// Importing React and necessary hooks/components from the project and libraries
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Button component from the project's UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components for display
import { Input } from "@/components/ui/input"; // Input component for forms
import { Textarea } from "@/components/ui/textarea"; // Textarea component for multi-line inputs
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Dialog components for modal implementation
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
} from "date-fns"; // date-fns library for date manipulation

// Main component function
function App() {
  // State to manage the currently selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  // State to toggle between "month" and "week" views
  const [view, setView] = useState("month");
  // State to store all meetings
  const [meetings, setMeetings] = useState(initialMeetings);
  // State to store the meeting currently selected for editing
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  // State to manage the visibility of the meeting modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to manage the visibility of the delete confirmation modal
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  // Form state for meeting details (title, description, date, time)
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    time: "",
  });

  // Calculate all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Calculate all days in the current week
  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  // Function to handle date changes
  const handleDateChange = (date) => {
    setCurrentDate(date);
    if (view === "week") {
      setCurrentDate(startOfWeek(date)); // If in week view, set date to the start of the week
    }
  };

  // Function to open the modal for adding a new meeting
  const openModalForAdd = (day) => {
    setForm({ title: "", description: "", date: format(day, "yyyy-MM-dd"), time: "" });
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing meeting
  const openModalForEdit = (meeting) => {
    setSelectedMeeting(meeting); // Set the meeting to be edited
    setForm({
      title: meeting.title,
      description: meeting.description,
      date: format(meeting.date, "yyyy-MM-dd"),
      time: meeting.time,
    });
    setIsModalOpen(true);
  };

  // Function to handle form submission for adding or editing a meeting
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeeting = { ...form, date: new Date(form.date) }; // Create a new meeting object
    if (selectedMeeting) {
      // Update existing meeting
      setMeetings(meetings.map((m) => (m === selectedMeeting ? newMeeting : m)));
    } else {
      // Add new meeting to the list
      setMeetings([...meetings, newMeeting]);
    }
    setIsModalOpen(false); // Close the modal
    setSelectedMeeting(null); // Clear selected meeting
  };

  // Function to confirm and delete the selected meeting
  const confirmDeleteMeeting = () => {
    setMeetings(meetings.filter((m) => m !== selectedMeeting)); // Remove meeting from the list
    setSelectedMeeting(null); // Clear selected meeting
    setIsDeleteConfirmationOpen(false); // Close confirmation modal
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header with navigation buttons */}
      <header className="flex flex-wrap gap-2 justify-between items-center mb-6 bg-white p-4 shadow rounded-lg">
        <Button onClick={() => handleDateChange(subMonths(currentDate, 1))}>Previous</Button>
        <Input
          type="date"
          value={format(currentDate, "yyyy-MM-dd")}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          aria-label="Date Picker"
          className="max-w-xs"
        />
        <Button onClick={() => handleDateChange(new Date())}>Today</Button>
        <Button onClick={() => handleDateChange(addMonths(currentDate, 1))}>Next</Button>
      </header>

      {/* Toggle between Month and Week views */}
      <Button
        onClick={() => setView(view === "month" ? "week" : "month")}
        className="mb-6 w-full sm:w-auto"
      >
        {view === "month" ? "Switch to Week View" : "Switch to Month View"}
      </Button>

      {/* Render days in the selected view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {(view === "month" ? daysInMonth : daysInWeek).map((day) => (
          <div
            key={day.toISOString()}
            className="relative bg-white p-4 rounded-lg shadow h-48 w-full cursor-pointer hover:shadow-lg transition"
            onClick={() => openModalForAdd(day)}
          >
            <CardHeader className="p-2">
              <CardTitle className="text-lg font-bold">{format(day, "d")}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 text-sm overflow-auto h-32">
              {meetings
                .filter((meeting) => isSameDay(new Date(meeting.date), day))
                .map((meeting) => (
                  <div
                    key={meeting.title}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      openModalForEdit(meeting);
                    }}
                    className="cursor-pointer bg-gray-100 p-2 rounded mb-2"
                  >
                    <strong>{meeting.time}</strong>
                    <div>{meeting.title}</div>
                  </div>
                ))}
            </CardContent>
          </div>
        ))}
      </div>

      {/* Button to add a new meeting */}
      <Button onClick={() => openModalForAdd(new Date())} className="mt-6 w-full sm:w-auto">
        Add Meeting
      </Button>

      {/* Modal for adding or editing meetings */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMeeting ? "Edit Meeting" : "Add Meeting"}</DialogTitle>
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              type="date"
              value={form.date}
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

      {/* Confirmation dialog for deleting a meeting */}
      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this meeting?</p>
          <DialogFooter>
            <Button onClick={confirmDeleteMeeting} className="bg-red-500">
              Yes, Delete
            </Button>
            <Button onClick={() => setIsDeleteConfirmationOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Initial set of meetings
const initialMeetings = [
  { title: "Morning Standup", description: "Daily team sync", date: "2024-12-01", time: "09:00" },
  { title: "Client Call", description: "Discuss project progress", date: "2024-12-10", time: "14:30" },
  { title: "Lunch Break", description: "", date: "2024-12-15", time: "12:00" },
  { title: "Code Review", description: "Review pull requests", date: "2024-12-20", time: "16:00" },
  { title: "Gym Session", description: "Cardio and weights", date: "2024-12-25", time: "18:00" },
];

export default App; // Exporting the component
