import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Dummy data for weather and moods
const weatherData = [
  { date: "2023-06-01", condition: "Sunny", temperature: 25, aqi: 50 },
  { date: "2023-06-02", condition: "Rainy", temperature: 18, aqi: 30 },
  { date: "2023-06-03", condition: "Cloudy", temperature: 22, aqi: 40 },
  // ... (add more dummy data for 20 days)
];

const moodData = [
  { date: "2023-05-28", mood: "Happy" },
  { date: "2023-05-29", mood: "Neutral" },
  { date: "2023-05-30", mood: "Sad" },
  { date: "2023-05-31", mood: "Happy" },
  { date: "2023-06-01", mood: "Neutral" },
  { date: "2023-06-02", mood: "Happy" },
  { date: "2023-06-03", mood: "Happy" },
];

const activitySuggestions = {
  Sunny: {
    Happy: ["Go for a picnic", "Play outdoor sports"],
    Neutral: ["Take a leisurely walk", "Read a book in the park"],
    Sad: ["Sunbathe to boost mood", "Meet friends for outdoor lunch"],
  },
  Rainy: {
    Happy: ["Have a movie marathon", "Try indoor rock climbing"],
    Neutral: ["Visit a museum", "Cook a new recipe"],
    Sad: ["Write in a journal", "Call a friend for a chat"],
  },
  Cloudy: {
    Happy: ["Go for a bike ride", "Have a backyard barbecue"],
    Neutral: ["Visit a local cafe", "Do some gardening"],
    Sad: ["Practice yoga or meditation", "Listen to uplifting music"],
  },
};

const WeatherCard = ({ weather }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Today's Weather</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Condition: {weather.condition}</p>
      <p>Temperature: {weather.temperature}°C</p>
      <p>AQI: {weather.aqi}</p>
    </CardContent>
  </Card>
);

const MoodTracker = ({ onMoodSelect }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>How are you feeling today?</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-around">
        <Button onClick={() => onMoodSelect("Happy")}>😊</Button>
        <Button onClick={() => onMoodSelect("Neutral")}>😐</Button>
        <Button onClick={() => onMoodSelect("Sad")}>😢</Button>
      </div>
    </CardContent>
  </Card>
);

const WeeklyMoodTrend = ({ moodData }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Weekly Mood Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between">
        {moodData.map((day, index) => (
          <div key={index} className="text-center">
            <p>{day.date.slice(-2)}</p>
            <p>{day.mood === "Happy" ? "😊" : day.mood === "Neutral" ? "😐" : "😢"}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ActivitySuggestions = ({ weather, mood }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Suggested Activities</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        {activitySuggestions[weather.condition][mood].map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const WeatherTable = ({ weatherData, filters }) => {
  const filteredData = weatherData.filter((day) => {
    return (
      (!filters.date || day.date === filters.date) &&
      (!filters.condition || day.condition === filters.condition) &&
      (!filters.temperature || day.temperature === parseInt(filters.temperature)) &&
      (!filters.aqi || day.aqi === parseInt(filters.aqi))
    );
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Temperature (°C)</TableHead>
          <TableHead>AQI</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((day, index) => (
          <TableRow key={index}>
            <TableCell>{day.date}</TableCell>
            <TableCell>{day.condition}</TableCell>
            <TableCell>{day.temperature}</TableCell>
            <TableCell>{day.aqi}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function App() {
  const [mood, setMood] = useState("Neutral");
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weather and Mood Widget</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeatherCard weather={weatherData[0]} />
        <MoodTracker onMoodSelect={setMood} />
      </div>
      <WeeklyMoodTrend moodData={moodData} />
      <ActivitySuggestions weather={weatherData[0]} mood={mood} />
      
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <Input
            type="date"
            placeholder="Date"
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
          <Select onValueChange={(value) => handleFilterChange("condition", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sunny">Sunny</SelectItem>
              <SelectItem value="Rainy">Rainy</SelectItem>
              <SelectItem value="Cloudy">Cloudy</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Temperature"
            min="10"
            max="35"
            onChange={(e) => handleFilterChange("temperature", e.target.value)}
          />
          <Select onValueChange={(value) => handleFilterChange("aqi", value)}>
            <SelectTrigger>
              <SelectValue placeholder="AQI" />
            </SelectTrigger>
            <SelectContent>
              {[20, 30, 40, 50, 100, 150, 200, 250, 300].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <WeatherTable weatherData={weatherData} filters={filters} />
    </div>
  );
}