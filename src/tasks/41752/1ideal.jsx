import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for matches
const mockMatches = [
  {
    id: 1,
    teamA: "Red Dragons",
    teamB: "Blue Knights",
    startTime: "2023-06-15T14:00:00",
    status: "Live",
    score: { teamA: 2, teamB: 1 },
    players: [
      { name: "John Doe", team: "Red Dragons", stats: "1 Goal, 2 Assists" },
      { name: "Jane Smith", team: "Blue Knights", stats: "1 Goal, 1 Yellow Card" },
    ],
    timeline: [
      { time: "15'", event: "Goal by John Doe (Red Dragons)" },
      { time: "32'", event: "Yellow Card for Jane Smith (Blue Knights)" },
      { time: "47'", event: "Goal by Jane Smith (Blue Knights)" },
      { time: "68'", event: "Goal by Red Dragons" },
    ],
  },
  {
    id: 2,
    teamA: "Green Titans",
    teamB: "Yellow Storms",
    startTime: "2023-06-16T19:30:00",
    status: "Upcoming",
    score: { teamA: 0, teamB: 0 },
    players: [
      { name: "Mike Johnson", team: "Green Titans", stats: "Top Scorer" },
      { name: "Sarah Lee", team: "Yellow Storms", stats: "Most Assists" },
    ],
    timeline: [],
  },
  // Add more mock matches here...
];

const MatchCard = ({ match, onClick }) => (
  <Card className="mb-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
    <CardHeader>
      <CardTitle className="text-lg">
        {match.teamA} vs {match.teamB}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">
        {new Date(match.startTime).toLocaleString()}
      </p>
      <Badge
        className={`mt-2 ${
          match.status === "Live"
            ? "bg-green-500"
            : match.status === "Completed"
            ? "bg-blue-500"
            : "bg-yellow-500"
        }`}
      >
        {match.status}
      </Badge>
    </CardContent>
  </Card>
);

const MatchDetails = ({ match, onBack }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">
        {match.teamA} vs {match.teamB}
      </CardTitle>
      <Button onClick={onBack} className="mt-2">
        Back to Matches
      </Button>
    </CardHeader>
    <CardContent>
      <h3 className="text-xl font-semibold mb-2">Score</h3>
      <p>
        {match.teamA}: {match.score.teamA} - {match.teamB}: {match.score.teamB}
      </p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Players</h3>
      <ul>
        {match.players.map((player, index) => (
          <li key={index}>
            {player.name} ({player.team}) - {player.stats}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">Timeline</h3>
      <ul>
        {match.timeline.map((event, index) => (
          <li key={index}>
            {event.time}: {event.event}
          </li>
        ))}
      </ul>

      <Badge
        className={`mt-4 ${
          match.status === "Live"
            ? "bg-green-500"
            : match.status === "Completed"
            ? "bg-blue-500"
            : "bg-yellow-500"
        }`}
      >
        {match.status}
      </Badge>
    </CardContent>
  </Card>
);

export default function App() {
  const [matches, setMatches] = useState(mockMatches);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredMatches = matches.filter(
    (match) =>
      (match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.teamB.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || match.status === statusFilter)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Match Scores Viewer</h1>
      {selectedMatch ? (
        <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />
      ) : (
        <>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="All">All Statuses</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <ScrollArea className="h-[70vh]">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => setSelectedMatch(match)}
              />
            ))}
          </ScrollArea>
        </>
      )}
    </div>
  );
}