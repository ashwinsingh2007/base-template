import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Card, CardContent, CardHeader, CardTitle, CardDescription, Rating } from "@/components/ui";

// Dummy Data
const initialMovies = [
  { id: 1, title: "Inception", year: 2010, ratings: [5, 4, 5, 4, 5] },
  { id: 2, title: "The Dark Knight", year: 2008, ratings: [5, 5, 4, 5, 4] },
  { id: 3, title: "Pulp Fiction", year: 1994, ratings: [5, 4, 3, 4, 5] },
  { id: 4, title: "Forrest Gump", year: 1994, ratings: [4, 4, 5, 4, 3] },
  { id: 5, title: "The Matrix", year: 1999, ratings: [5, 5, 5, 4, 5] },
  { id: 6, title: "Interstellar", year: 2014, ratings: [5, 4, 5, 3, 5] },
  { id: 7, title: "Gladiator", year: 2000, ratings: [4, 5, 4, 5, 4] },
  { id: 8, title: "Parasite", year: 2019, ratings: [5, 5, 4, 5, 4] },
  { id: 9, title: "Fight Club", year: 1999, ratings: [5, 4, 5, 4, 5] },
  { id: 10, title: "The Godfather", year: 1972, ratings: [5, 5, 5, 5, 5] },
];

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [open, setOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: '', year: '' });
  const [filter, setFilter] = useState({ year: '', rating: '', name: '', myRating: '' });
  const [currentUserRating, setCurrentUserRating] = useState({});

  // Function to add a new movie
  const addMovie = () => {
    if (newMovie.title && newMovie.year) {
      setMovies([...movies, { 
        id: movies.length + 1, 
        title: newMovie.title, 
        year: parseInt(newMovie.year), 
        ratings: [] 
      }]);
      setOpen(false);
      setNewMovie({ title: '', year: '' });
    }
  };

  // Function to rate a movie
  const rateMovie = (movieId, rating) => {
    const updatedMovies = movies.map(movie => 
      movie.id === movieId ? { ...movie, ratings: [...movie.ratings, rating] } : movie
    );
    setMovies(updatedMovies);
    setCurrentUserRating({ ...currentUserRating, [movieId]: rating });
  };

  // Filter movies based on criteria
  const filteredMovies = movies.filter(movie => 
    (filter.year ? movie.year === parseInt(filter.year) : true) &&
    (filter.rating ? Math.round(movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length) === parseInt(filter.rating) : true) &&
    (filter.name ? movie.title.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
    (filter.myRating !== '' ? (currentUserRating[movie.id] || 0) === parseInt(filter.myRating) : true)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Movie Rating App</h1>
      <div className="flex flex-wrap justify-between mb-4">
        <Button onClick={() => setOpen(true)}>Add Movie</Button>
        <div className="flex space-x-2">
          <Input placeholder="Filter by Name" onChange={(e) => setFilter({...filter, name: e.target.value})} />
          <Input type="number" placeholder="Year" onChange={(e) => setFilter({...filter, year: e.target.value})} />
          <Input type="number" placeholder="Rating" onChange={(e) => setFilter({...filter, rating: e.target.value})} />
          <Input type="number" placeholder="My Rating" onChange={(e) => setFilter({...filter, myRating: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMovies.map(movie => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription>Year: {movie.year}</CardDescription>
            </CardHeader>
            <CardContent>
              <Rating 
                value={currentUserRating[movie.id] || 0} 
                onChange={(value) => rateMovie(movie.id, value)} 
                max={5}
              />
              <p>Average Rating: {movie.ratings.length ? (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(1) : 'No ratings'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add New Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} placeholder="Movie Title" />
            <Input value={newMovie.year} onChange={(e) => setNewMovie({...newMovie, year: e.target.value})} placeholder="Release Year" type="number" className="mt-2" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={addMovie}>Add</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}