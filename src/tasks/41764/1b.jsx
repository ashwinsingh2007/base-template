import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data for initial movies
const initialMovies = [
  { id: 1, title: "Inception", year: 2010, ratings: [4, 5, 3, 4, 5] },
  { id: 2, title: "The Shawshank Redemption", year: 1994, ratings: [5, 5, 5, 4, 5] },
  { id: 3, title: "The Dark Knight", year: 2008, ratings: [5, 4, 5, 5, 4] },
  { id: 4, title: "Pulp Fiction", year: 1994, ratings: [4, 5, 4, 3, 5] },
  { id: 5, title: "Forrest Gump", year: 1994, ratings: [4, 4, 5, 5, 4] },
  { id: 6, title: "The Matrix", year: 1999, ratings: [5, 4, 5, 4, 5] },
  { id: 7, title: "Goodfellas", year: 1990, ratings: [4, 5, 4, 4, 5] },
  { id: 8, title: "The Silence of the Lambs", year: 1991, ratings: [5, 4, 4, 5, 4] },
  { id: 9, title: "Schindler's List", year: 1993, ratings: [5, 5, 5, 5, 4] },
  { id: 10, title: "The Lord of the Rings: The Return of the King", year: 2003, ratings: [5, 5, 4, 5, 5] },
];

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onRate(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const MovieCard = ({ movie, onRate }) => {
  const avgRating = movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length;

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Year: {movie.year}</p>
        <p>Average Rating: {avgRating.toFixed(1)}</p>
        <StarRating rating={avgRating} onRate={(rating) => onRate(movie.id, rating)} />
      </CardContent>
    </Card>
  );
};

const AddMovieModal = ({ onAddMovie }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMovie({ title, year: parseInt(year) });
    setTitle("");
    setYear("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Movie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Release Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <Button type="submit">Add Movie</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [filters, setFilters] = useState({ year: "", rating: "", name: "", ratedByMe: false });

  const handleAddMovie = (newMovie) => {
    setMovies([...movies, { ...newMovie, id: movies.length + 1, ratings: [] }]);
  };

  const handleRate = (id, rating) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, ratings: [...movie.ratings, rating] } : movie
      )
    );
  };

  const filteredMovies = movies.filter((movie) => {
    const avgRating = movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length;
    return (
      (!filters.year || movie.year.toString() === filters.year) &&
      (!filters.rating || Math.round(avgRating).toString() === filters.rating) &&
      (!filters.name || movie.title.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.ratedByMe || movie.ratings.length > 0)
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Movie Rating App</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Select onValueChange={(value) => setFilters({ ...filters, year: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(movies.map((m) => m.year))).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilters({ ...filters, rating: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-[180px]"
        />
        <Button
          onClick={() => setFilters({ ...filters, ratedByMe: !filters.ratedByMe })}
          variant={filters.ratedByMe ? "default" : "outline"}
        >
          Rated by Me
        </Button>
      </div>
      <AddMovieModal onAddMovie={handleAddMovie} />
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
}