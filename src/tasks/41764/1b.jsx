import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data for initial movies
const initialMovies = [
  { id: 1, title: "Inception", year: 2010, ratings: [4, 5, 3, 4, 5] },
  { id: 2, title: "The Shawshank Redemption", year: 1994, ratings: [5, 5, 5, 4, 5] },
  { id: 3, title: "The Dark Knight", year: 2008, ratings: [5, 4, 5, 5, 4] },
  { id: 4, title: "Pulp Fiction", year: 1994, ratings: [4, 5, 4, 3, 5] },
  { id: 5, title: "Forrest Gump", year: 1994, ratings: [4, 4, 5, 5, 4] },
  { id: 6, title: "The Matrix", year: 1999, ratings: [5, 4, 5, 4, 5] },
  { id: 7, title: "Goodfellas", year: 1990, ratings: [5, 5, 4, 4, 5] },
  { id: 8, title: "The Silence of the Lambs", year: 1991, ratings: [4, 5, 5, 4, 4] },
  { id: 9, title: "Schindler's List", year: 1993, ratings: [5, 5, 5, 5, 4] },
  { id: 10, title: "Fight Club", year: 1999, ratings: [4, 5, 4, 5, 4] },
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
        <StarRating rating={0} onRate={(rating) => onRate(movie.id, rating)} />
      </CardContent>
    </Card>
  );
};

const AddMovieModal = ({ onAddMovie }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMovie({ title, year: parseInt(year), ratings: [] });
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
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Movie</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [nameFilter, setNameFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [myRatingsFilter, setMyRatingsFilter] = useState(false);

  useEffect(() => {
    let result = movies;

    if (nameFilter) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (yearFilter) {
      result = result.filter((movie) => movie.year.toString() === yearFilter);
    }

    if (ratingFilter) {
      result = result.filter((movie) => {
        const avgRating =
          movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length;
        return Math.round(avgRating) === parseInt(ratingFilter);
      });
    }

    if (myRatingsFilter) {
      result = result.filter((movie) => movie.ratings.length > 5);
    }

    setFilteredMovies(result);
  }, [movies, nameFilter, yearFilter, ratingFilter, myRatingsFilter]);

  const handleAddMovie = (newMovie) => {
    setMovies([...movies, { ...newMovie, id: movies.length + 1 }]);
  };

  const handleRateMovie = (id, rating) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, ratings: [...movie.ratings, rating] }
          : movie
      )
    );
  };

  const clearFilters = () => {
    setNameFilter("");
    setYearFilter("");
    setRatingFilter("");
    setMyRatingsFilter(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Movie Rating App</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(movies.map((m) => m.year))).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={myRatingsFilter ? "default" : "outline"}
          onClick={() => setMyRatingsFilter(!myRatingsFilter)}
        >
          My Ratings
        </Button>
        <Button onClick={clearFilters}>Clear Filters</Button>
      </div>
      <AddMovieModal onAddMovie={handleAddMovie} />
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onRate={handleRateMovie} />
        ))}
      </div>
    </div>
  );
}