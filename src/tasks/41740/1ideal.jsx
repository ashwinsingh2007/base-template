import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Dummy data for weather and moods
// This creates an array of weather data for the past 21 days with random conditions, temperatures, and AIQ (Air Quality Index) values.
const weatherData = Array.from({ length: 21 }, (_, i) => ({
  date: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Generates a date string for each day
  condition: ['sunny', 'rainy', 'cloudy'][Math.floor(Math.random() * 3)], // Random weather condition
  temperature: Math.floor(Math.random() * 25) + 10, // Random temperature between 10 and 35
  aiq: Math.floor(Math.random() * 280) + 20, // Random AIQ between 20 and 300
}));

// Possible mood emojis to select from
const moodData = ['😊', '😐', '😢'];

// Randomly generates a week's mood trend using the moodData array
const weeklyMoodTrend = Array.from({ length: 7 }, () => moodData[Math.floor(Math.random() * 3)]);

// Suggestions for activities based on weather and mood
const activitySuggestions = {
  sunny: { '😊': 'Go for a picnic', '😐': 'Take a walk in the park', '😢': 'Sunbathe to lift your spirits' },
  rainy: { '😊': 'Read a book indoors', '😐': 'Watch a movie', '😢': 'Cook your favorite comfort food' },
  cloudy: { '😊': 'Go for a bike ride', '😐': 'Visit a museum', '😢': 'Call a friend for a chat' },
};

export default function App() {
  // State for user-selected filters and mood
  const [currentMood, setCurrentMood] = useState('😊'); // Current mood
  const [dateFilter, setDateFilter] = useState(''); // Filter for a specific date
  const [moodFilter, setMoodFilter] = useState(''); // Filter for a specific mood
  const [tempFilter, setTempFilter] = useState(''); // Filter for temperature
  const [conditionFilter, setConditionFilter] = useState(''); // Filter for weather condition
  const [aiqFilter, setAiqFilter] = useState(''); // Filter for AIQ

  // Today's weather data (middle of the array for simplicity)
  const todayWeather = weatherData[10];

  // Filters the weather data based on user inputs
  const filteredWeatherData = weatherData.filter(day => {
    return (
      (!dateFilter || day.date === dateFilter) && // Matches date if filter is applied
      (!tempFilter || day.temperature === parseInt(tempFilter)) && // Matches temperature if filter is applied
      (!conditionFilter || day.condition === conditionFilter) && // Matches condition if filter is applied
      (!aiqFilter || day.aiq === parseInt(aiqFilter)) // Matches AIQ if filter is applied
    );
  });

  // Resets all filters to their default values
  const clearFilters = () => {
    setDateFilter('');
    setMoodFilter('');
    setTempFilter('');
    setConditionFilter('');
    setAiqFilter('');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Card displaying today's weather */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              {/* Displays today's weather details */}
              <p className="text-2xl font-bold">{todayWeather.condition}</p>
              <p>Temperature: {todayWeather.temperature}°C</p>
              <p>AIQ: {todayWeather.aiq}</p>
            </div>
            <div>
              {/* Mood selection buttons */}
              <p className="mb-2">How are you feeling today?</p>
              <div className="flex space-x-2">
                {moodData.map((mood) => (
                  <Button
                    key={mood}
                    onClick={() => setCurrentMood(mood)}
                    variant={currentMood === mood ? "default" : "outline"}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card displaying weekly mood trend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weekly Mood Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {weeklyMoodTrend.map((mood, index) => (
              <div key={index} className="text-2xl">
                {mood}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card suggesting activities based on current weather and mood */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Activity Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Suggests an activity */}
          <p>{activitySuggestions[todayWeather.condition][currentMood]}</p>
        </CardContent>
      </Card>

      {/* Card displaying a weather history table with filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weather History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {/* Inputs for applying filters */}
            <Input
              placeholder="Date (YYYY-MM-DD)"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mood" />
              </SelectTrigger>
              <SelectContent>
                {moodData.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Temperature"
              type="number"
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
            />
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {['sunny', 'rainy', 'cloudy'].map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="AIQ"
              type="number"
              value={aiqFilter}
              onChange={(e) => setAiqFilter(e.target.value)}
            />
          </div>
          {/* Button to clear filters */}
          <Button onClick={clearFilters} className="mb-4">Clear Filters</Button>
          {/* Weather data table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>AIQ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWeatherData.map((day) => (
                <TableRow key={day.date}>
                  <TableCell>{day.date}</TableCell>
                  <TableCell>{day.condition}</TableCell>
                  <TableCell>{day.temperature}°C</TableCell>
                  <TableCell>{day.aiq}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
