import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample data for matches
const sampleMatches = [
  { id: 1, home: 'Team A', away: 'Team B', start: '15:00', status: 'Live', scores: { home: 2, away: 1 }, players: [{name: 'Player 1', role: 'Forward', stats: '2 goals'}, {name: 'Player 2', role: 'Goalkeeper', stats: '5 saves'}], timeline: ['15:05 Goal by Team A', '15:30 Yellow Card Team B'] },
  { id: 2, home: 'Team C', away: 'Team D', start: '18:00', status: 'Upcoming', scores: { home: 0, away: 0 }},
  { id: 3, home: 'Player X', away: 'Player Y', start: 'Yesterday', status: 'Completed', scores: { home: 6, away: 3 }, players: [{name: 'Player X', role: 'Single', stats: '6 points'}, {name: 'Player Y', role: 'Single', stats: '3 points'}] },
];

function MatchList({ matches, onMatchSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredMatches = matches.filter(match => 
    (filterStatus === 'All' || match.status === filterStatus) &&
    (match.home.toLowerCase().includes(searchTerm.toLowerCase()) || 
     match.away.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <Input 
        type="text" 
        placeholder="Search matches..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      <div className="mb-4">
        <Button onClick={() => setFilterStatus('All')} variant={filterStatus === 'All' ? 'default' : 'outline'}>All</Button>
        <Button onClick={() => setFilterStatus('Live')} variant={filterStatus === 'Live' ? 'default' : 'outline'} className="ml-2">Live</Button>
        <Button onClick={() => setFilterStatus('Upcoming')} variant={filterStatus === 'Upcoming' ? 'default' : 'outline'} className="ml-2">Upcoming</Button>
        <Button onClick={() => setFilterStatus('Completed')} variant={filterStatus === 'Completed' ? 'default' : 'outline'} className="ml-2">Completed</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMatches.map(match => (
          <Card key={match.id} onClick={() => onMatchSelect(match)}>
            <CardHeader>
              <CardTitle>{match.home} vs {match.away}</CardTitle>
              <CardDescription>Start: {match.start}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={match.status === 'Live' ? 'success' : match.status === 'Upcoming' ? 'warning' : 'default'}>
                {match.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MatchDetail({ match, onBack }) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{match.home} vs {match.away}</CardTitle>
          <CardDescription>Status: {match.status}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Scores: {match.home} {match.scores.home} - {match.away} {match.scores.away}</div>
          <h4 className="mt-4 mb-2 font-bold">Players:</h4>
          <ul>
            {match.players?.map((player, index) => (
              <li key={index}>{player.name} ({player.role}) - {player.stats}</li>
            ))}
          </ul>
          <h4 className="mt-4 mb-2 font-bold">Timeline:</h4>
          <ul>
            {match.timeline?.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack}>Back to List</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <div className="App">
      {selectedMatch ? 
        <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} /> : 
        <MatchList matches={sampleMatches} onMatchSelect={setSelectedMatch} />
      }
    </div>
  );
}