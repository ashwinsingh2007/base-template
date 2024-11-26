import React, { useState, useEffect } from "react";
// Importing UI components for Card, Button, Input, Dialog, Label, and Select from a custom UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dummy data for the initial list of movies
const initialMovies = [
  { id: 1, title: "Inception", year: 2010, ratings: [4, 5, 3, 4, 5] },
  { id: 2, title: "The Shawshank Redemption", year: 1994, ratings: [5, 5, 5, 4, 5] },
  { id: 3, title: "The Dark Knight", year: 2008, ratings: [5, 4, 5, 5, 4] },
  // Additional movie data for diversity
  { id: 4, title: "Pulp Fiction", year: 1994, ratings: [4, 5, 4, 3, 5] },
  { id: 5, title: "Forrest Gump", year: 1994, ratings: [4, 4, 5, 5, 4] },
];

// Component to display star ratings with interactive functionality
const StarRating = ({ rating, onRate }) => {
  // Displays stars in yellow if they are below or equal to the rating, otherwise gray
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star} // Unique key for each star
          className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onRate(star)} // Calls the onRate function when a star is clicked
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Component to display details of a single movie
const MovieCard = ({ movie, onRate }) => {
  // Calculate the average rating of the movie. If no ratings exist, show null
  const avgRating = movie.ratings.length
    ? movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length
    : null;

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display year and average rating. Show "No ratings yet" if no ratings exist */}
        <p>Year: {movie.year}</p>
        <p>Average Rating: {avgRating ? avgRating.toFixed(1) : "No ratings yet"}</p>
        {/* Pass the average rating and onRate function to the StarRating component */}
        <StarRating
          rating={movie.ratings[movie.ratings.length - 1] || 0}
          onRate={(rating) => onRate(movie.id, rating)}
        />
      </CardContent>
    </Card>
  );
};

// Component for adding a new movie through a modal
const AddMovieModal = ({ onAddMovie }) => {
  // State to control the visibility of the modal
  const [isOpen, setIsOpen] = useState(false);
  // State to store the input for the movie title
  const [title, setTitle] = useState("");
  // State to store the input for the movie release year
  const [year, setYear] = useState("");

  // Function to handle the form submission when adding a movie
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Call the onAddMovie function with the new movie details
    onAddMovie({ title, year: parseInt(year), ratings: [] });
    // Reset the input fields and close the modal
    setTitle("");
    setYear("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog trigger button to open the modal */}
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Add New Movie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input for movie title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Input for movie release year */}
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
          {/* Submit button */}
          <Button type="submit">Add Movie</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  // State to manage the list of all movies
  const [movies, setMovies] = useState(initialMovies);
  // State to manage the filtered movies based on filters applied
  const [filteredMovies, setFilteredMovies] = useState(movies);
  // State to track the filter applied for movie titles
  const [nameFilter, setNameFilter] = useState("");
  // State to track the year filter
  const [yearFilter, setYearFilter] = useState("");
  // State to track the rating filter
  const [ratingFilter, setRatingFilter] = useState("");
  // State to track whether the "My Ratings" filter is applied
  const [myRatingsFilter, setMyRatingsFilter] = useState(false);

  // Effect to filter movies whenever filters or the movie list changes
  useEffect(() => {
    let result = movies;

    // Filter movies by title
    if (nameFilter) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filter movies by year
    if (yearFilter) {
      result = result.filter((movie) => movie.year.toString() === yearFilter);
    }

    // Filter movies by average rating
    if (ratingFilter) {
      result = result.filter((movie) => {
        const avgRating =
          movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length;
        return Math.round(avgRating) === parseInt(ratingFilter);
      });
    }

    // Filter movies by whether they have more than 5 ratings
    if (myRatingsFilter) {
      result = result.filter((movie) => movie.ratings.length > 5);
    }

    // Update the filtered movies
    setFilteredMovies(result);
  }, [movies, nameFilter, yearFilter, ratingFilter, myRatingsFilter]);

  // Function to add a new movie to the list
  const handleAddMovie = (newMovie) => {
    setMovies([...movies, { ...newMovie, id: movies.length + 1 }]);
  };

  // Function to update the ratings for a specific movie
  const handleRateMovie = (id, rating) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, ratings: [...movie.ratings, rating] }
          : movie
      )
    );
  };

  // Function to clear all applied filters
  const clearFilters = () => {
    setNameFilter("");
    setYearFilter("");
    setRatingFilter("");
    setMyRatingsFilter(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* App header */}
      <h1 className="text-3xl font-bold mb-4">Movie Rating App</h1>
      {/* Filter controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        {/* Input for filtering movies by name */}
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full sm:w-auto"
        />
        {/* Dropdown for filtering movies by year */}
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
        {/* Dropdown for filtering movies by rating */}
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
        {/* Button to toggle "My Ratings" filter */}
        <Button
          variant={myRatingsFilter ? "default" : "outline"}
          onClick={() => setMyRatingsFilter(!myRatingsFilter)}
        >
          My Ratings
        </Button>
        {/* Button to clear all filters */}
        <Button onClick={clearFilters}>Clear Filters</Button>
      </div>
      {/* Modal to add new movies */}
      <AddMovieModal onAddMovie={handleAddMovie} />
      {/* Render filtered movies */}
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onRate={handleRateMovie} />
        ))}
      </div>
    </div>
  );
}
