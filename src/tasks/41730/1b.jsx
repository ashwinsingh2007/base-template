import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, set, getDate, getMonth, getYear, startOfWeek, endOfWeek } from 'date-fns';

// Utility function to generate days for the calendar
function generateDays(currentDate) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return eachDayOfInterval({ start, end });
}

// Dummy meetings
const dummyMeetings = [
  { id: 1, title: "Project Kickoff", date: new Date(2024, 11, 5, 10, 0), description: "Start of the new project phase." },
  { id: 2, title: "Team Sync", date: new Date(2024, 11, 12, 15, 30), description: "Weekly team synchronization meeting." },
  { id: 3, title: "Client Review", date: new Date(2024, 11, 18, 9, 0), description: "Review progress with the client." },
  { id: 4, title: "Design Workshop", date: new Date(2024, 11, 22, 14, 0), description: "Workshop for the new UI design." },
  { id: 5, title: "Release Planning", date: new Date(2024, 11, 30, 11, 0), description: "Plan for the next release cycle." },
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1));
  const [view, setView] = useState('month');
  const [meetings, setMeetings] = useState(dummyMeetings);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: new Date(), description: '' });

  const days = useMemo(() => {
    return view === 'month' ? generateDays(currentDate) : eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) });
  }, [currentDate, view]);

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setModalOpen(true);
  };

  const handleNewMeeting = () => {
    setNewMeeting({ title: '', date: new Date(), description: '' });
    setModalOpen(true);
  };

  const saveMeeting = () => {
    if (selectedMeeting) {
      const updatedMeetings = meetings.map(m => m.id === selectedMeeting.id ? { ...newMeeting, id: m.id } : m);
      setMeetings(updatedMeetings);
    } else {
      setMeetings([...meetings, { ...newMeeting, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const deleteMeeting = () => {
    setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <Button onClick={() => setView(view === 'month' ? 'week' : 'month')}>
            Toggle {view === 'month' ? 'Week' : 'Month'} View
          </Button>
          <Button onClick={handleNewMeeting}>Add Meeting</Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Previous</Button>
            <Input 
              type="date" 
              value={format(currentDate, 'yyyy-MM-dd')} 
              onChange={(e) => handleDateChange(new Date(e.target.value))} 
              className="w-1/3"
            />
            <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</Button>
            <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
              <div key={day} className="font-bold text-center">{day}</div>
            )}
            {days.map(day => (
              <div 
                key={day.toString()} 
                className={`text-center p-2 border rounded ${getDate(day) === getDate(new Date()) ? 'bg-blue-500 text-white' : ''} ${getMonth(day) !== getMonth(currentDate) ? 'text-gray-400' : ''}`}
                onClick={() => handleDateChange(set(day, { hours: 12 }))} // Set to midday to avoid timezone issues
              >
                {getDate(day)}
                {meetings.filter(m => getDate(m.date) === getDate(day)).map(m => (
                  <div key={m.id} onClick={(e) => {e.stopPropagation(); handleMeetingClick(m);}} className="text-xs bg-yellow-200 mt-1 p-1 rounded cursor-pointer">
                    {m.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{selectedMeeting ? 'Edit Meeting' : 'New Meeting'}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} />
            <Label htmlFor="date">Date & Time</Label>
            <Input id="date" type="datetime-local" value={format(newMeeting.date, 'yyyy-MM-dd\'T\'HH:mm')} onChange={e => setNewMeeting({...newMeeting, date: new Date(e.target.value)})} />
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={saveMeeting}>Save</Button>
            {selectedMeeting && <Button onClick={deleteMeeting} variant="destructive">Delete</Button>}
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;