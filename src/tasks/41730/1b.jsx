import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: new Date(), time: '' });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate)
  });

  function handleDateChange(date) {
    setCurrentDate(date);
    if (view === 'week') {
      setCurrentDate(startOfWeek(date));
    }
  }

  function openModalForAdd() {
    setForm({ ...form, date: currentDate });
    setIsModalOpen(true);
  }

  function openModalForEdit(meeting) {
    setSelectedMeeting(meeting);
    setForm({ 
      title: meeting.title, 
      description: meeting.description, 
      date: meeting.date, 
      time: meeting.time 
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newMeeting = { ...form, date: new Date(form.date) };
    if (selectedMeeting) {
      setMeetings(meetings.map(m => m === selectedMeeting ? newMeeting : m));
    } else {
      setMeetings([...meetings, newMeeting]);
    }
    setIsModalOpen(false);
  }

  function deleteMeeting() {
    setMeetings(meetings.filter(m => m !== selectedMeeting));
    setIsModalOpen(false);
    setSelectedMeeting(null);
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between mb-4">
        <Button onClick={() => handleDateChange(view === 'month' ? subMonths(currentDate, 1) : subMonths(currentDate, 1))}>Previous</Button>
        <Button onClick={() => handleDateChange(new Date())}>Today</Button>
        <Button onClick={() => handleDateChange(view === 'month' ? addMonths(currentDate, 1) : addMonths(currentDate, 1))}>Next</Button>
      </div>
      <Button onClick={() => setView(view === 'month' ? 'week' : 'month')}>{view === 'month' ? 'Week View' : 'Month View'}</Button>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {(view === 'month' ? daysInMonth : daysInWeek).map(day => (
          <Card key={day.toISOString()} className="min-h-[100px]">
            <CardHeader className="p-2">
              <CardTitle className={`${isSameDay(day, new Date()) ? 'text-blue-500' : ''}`}>
                {format(day, 'd')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 text-xs">
              {meetings.filter(meeting => isSameDay(meeting.date, day)).map(meeting => (
                <div key={meeting.title} onClick={() => openModalForEdit(meeting)} className="cursor-pointer hover:bg-gray-100 p-1 rounded">
                  {meeting.time} - {meeting.title}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={openModalForAdd} className="mt-4">Add Meeting</Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMeeting ? 'Edit Meeting' : 'Add Meeting'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Title" 
              required 
            />
            <Textarea 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="Description" 
            />
            <Input 
              type="date" 
              value={format(form.date, 'yyyy-MM-dd')} 
              onChange={e => setForm({...form, date: e.target.value})} 
              required 
            />
            <Input 
              type="time" 
              value={form.time} 
              onChange={e => setForm({...form, time: e.target.value})} 
              required 
            />
            <Button type="submit">Save</Button>
            {selectedMeeting && 
              <Button onClick={deleteMeeting} type="button" className="ml-2 bg-red-500 hover:bg-red-600">
                Delete
              </Button>}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const initialMeetings = [
  { title: 'Morning Standup', description: 'Daily team sync', date: new Date(), time: '09:00' },
  { title: 'Client Call', description: 'Discuss project progress', date: new Date(), time: '14:30' },
  { title: 'Lunch Break', description: '', date: new Date(), time: '12:00' },
  { title: 'Code Review', description: 'Review pull requests', date: new Date(new Date().setDate(new Date().getDate() + 1)), time: '16:00' },
  { title: 'Gym Session', description: 'Cardio and weights', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '18:00' },
];

export default App;