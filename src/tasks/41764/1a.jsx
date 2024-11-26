import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { StarIcon } from '@heroicons/react/solid';

const initialMovies = [
  { id: 1, title: "Inception", year: 2010, ratings: [5, 5, 4, 5, 4] },
  { id: 2, title: "The Dark Knight", year: 2008, ratings: [5, 4, 5, 5, 4] },
  // ... 8 more movies ...
];

function Rating({ value, onRate }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <StarIcon 
          key={index} 
          className={`h-5 w-5 ${index < value ? 'text-yellow-500' : 'text-gray-300'}`} 
          onClick={() => onRate(index + 1)}
        />
      ))}
    </div>
  );
}

function MovieCard({ movie, onRate }) {
  const averageRating = movie.ratings.length ? 
    (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(1) : '0.0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>Released: {movie.year}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Average Rating: {averageRating}</p>
        <Rating value={0} onRate={(rating) => onRate(movie.id, rating)} />
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [isOpen, setIsOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: '', year: '' });
  const [filter, setFilter] = useState({ name: '', year: '', rating: '', myRating: '' });
  const [currentUserRating, setCurrentUserRating] = useState({});

  useEffect(() => {
    // Initialize user ratings for each movie to null or existing value
    let initialUserRatings = {};
    movies.forEach(movie => {
      initialUserRatings[movie.id] = currentUserRating[movie.id] || null;
    });
    setCurrentUserRating(initialUserRatings);
  }, [movies]);

  const addMovie = () => {
    if (newMovie.title && newMovie.year) {
      const newMovieObj = {
        id: movies.length + 1,
        title: newMovie.title,
        year: parseInt(newMovie.year, 10),
        ratings: []
      };
      setMovies([...movies, newMovieObj]);
      setNewMovie({ title: '', year: '' });
      setIsOpen(false);
    }
  };

  const rateMovie = (id, rating) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, ratings: [...movie.ratings, rating] } : movie
      )
    );
    setCurrentUserRating(prev => ({...prev, [id]: rating}));
  };

  const filteredMovies = movies.filter(movie => 
    (filter.name ? movie.title.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
    (filter.year ? movie.year === parseInt(filter.year, 10) : true) &&
    (filter.rating ? 
      (movie.ratings.length ? 
        (movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length).toFixed(1) === filter.rating : 
        false) : 
      true) &&
    (filter.myRating !== '' ? currentUserRating[movie.id] === parseInt(filter.myRating, 10) : true)
  );

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => setIsOpen(true)}>Add Movie</Button>
      <div className="flex space-x-4 my-4">
        <Input placeholder="Filter by Name" value={filter.name} onChange={e => setFilter({...filter, name: e.target.value})} />
        <Input type="number" placeholder="Year" value={filter.year} onChange={e => setFilter({...filter, year: e.target.value})} />
        <Input type="number" placeholder="Rating" value={filter.rating} onChange={e => setFilter({...filter, rating: e.target.value})} />
        <Input type="number" placeholder="My Rating" value={filter.myRating} onChange={e => setFilter({...filter, myRating: e.target.value})} />
        <Button onClick={() => setFilter({ name: '', year: '', rating: '', myRating: '' })}>Clear Filter</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onRate={rateMovie} />
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add New Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input 
              value={newMovie.title} 
              onChange={e => setNewMovie({...newMovie, title: e.target.value})} 
              placeholder="Movie Title" 
            />
            <Input 
              type="number" 
              value={newMovie.year} 
              onChange={e => setNewMovie({...newMovie, year: e.target.value})} 
              placeholder="Release Year" 
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={addMovie}>Add Movie</Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}