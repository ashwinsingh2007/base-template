import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';

// Dummy meetings for December 2024
const dummyMeetings = [
  { id: 1, title: 'Team Sync', date: new Date(2024, 11, 5, 10, 0), duration: 60, description: 'Weekly team meeting' },
  { id: 2, title: 'Client Call', date: new Date(2024, 11, 10, 14, 30), duration: 90, description: 'Discuss project updates' },
  // Add more meetings here...
];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11)); // Start with December 2024
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(null);
  const [meetings, setMeetings] = useState(dummyMeetings);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getDay(startOfMonth(currentDate));

  const getMonthDays = () => {
    let days = [];
    for (let i = 0; i < daysInMonth + firstDayIndex; i++) {
      const dayDate = new Date(currentDate);
      dayDate.setDate(dayDate.getDate() - firstDayIndex + i + 1);
      days.push({
        date: dayDate,
        isCurrentMonth: i >= firstDayIndex,
        isToday: isToday(dayDate),
        meetings: meetings.filter(m => m.date.toDateString() === dayDate.toDateString())
      });
    }
    return days;
  };

  const changeMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day.date);
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
          <div className="flex justify-between">
            <Button onClick={() => changeMonth('prev')}>Previous</Button>
            <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
            <Button onClick={() => changeMonth('next')}>Next</Button>
          </div>
          <Button onClick={() => setView(view === 'month' ? 'week' : 'month')}>
            Toggle {view === 'month' ? 'Week' : 'Month'} View
          </Button>
        </CardHeader>
        <CardContent>
          {view === 'month' ? (
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
                <div key={day} className="text-center font-bold">{day}</div>
              )}
              {getMonthDays().map((day, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleDayClick(day)} 
                  className={`text-center p-2 border rounded ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-100'} ${day.isToday ? 'bg-blue-500 text-white' : ''}`}
                >
                  {day.date.getDate()}
                  {day.meetings.length > 0 && <div className="text-xs mt-1">📅</div>}
                </div>
              ))}
            </div>
          ) : /* Week view implementation would go here */ null}
        </CardContent>
      </Card>
      {selectedDay && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{format(selectedDay, 'EEEE, MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.filter(m => m.date.toDateString() === selectedDay.toDateString()).map(meeting => (
              <div key={meeting.id} className="mb-2">
                <h3>{meeting.title}</h3>
                <p>{meeting.description}</p>
                <p>{format(meeting.date, 'hh:mm a')} - {format(new Date(meeting.date.getTime() + meeting.duration * 60000), 'hh:mm a')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 sm:p-6">
      <Calendar />
    </div>
  );
}