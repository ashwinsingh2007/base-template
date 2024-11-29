import React, { useState, useEffect } from "react";
// Importing necessary components from the UI library
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Generate dummy movie data
const generateMovies = () => {
  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"]; // List of movie genres
  const showTimes = ["2:00 PM", "5:30 PM", "8:00 PM"]; // Predefined showtimes

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1, // Unique movie ID
    name: `Movie ${i + 1}`, // Movie name
    genre: genres[Math.floor(Math.random() * genres.length)], // Random genre
    duration: Math.floor(Math.random() * 60) + 90, // Random duration between 90-150 minutes
    rating: parseFloat((Math.random() * 5).toFixed(1)), // Random rating between 0-5
    showTimes: showTimes.map(time => ({
      time, // Show time
      price: Math.floor(Math.random() * 10) + 10, // Random price between $10-$20
      availableSeats: Math.floor(Math.random() * 50) + 50, // Random seats between 50-100
    })),
  }));
};

export default function App() {
  const [movies, setMovies] = useState([]); // State to hold movie data
  const [filteredMovies, setFilteredMovies] = useState([]); // Filtered movie list based on search/sort
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [nameFilter, setNameFilter] = useState(""); // Filter by movie name
  const [genreFilter, setGenreFilter] = useState(""); // Filter by genre
  const [ratingFilter, setRatingFilter] = useState(""); // Filter by rating
  const [sortBy, setSortBy] = useState(""); // Sort by rating or duration
  const [bookingModal, setBookingModal] = useState(null); // Booking modal state
  const [bookings, setBookings] = useState([]); // List of booked movies
  const [successDetails, setSuccessDetails] = useState(null); // Success details for booking confirmation

  // Load movie data on component mount
  useEffect(() => {
    setMovies(generateMovies());
  }, []);

  // Filter and sort movies whenever filters or movies list changes
  useEffect(() => {
    let result = [...movies];
    if (nameFilter) {
      result = result.filter(movie => movie.name.toLowerCase().includes(nameFilter.toLowerCase())); // Filter by name
    }
    if (genreFilter) {
      result = result.filter(movie => movie.genre === genreFilter); // Filter by genre
    }
    if (ratingFilter) {
      result = result.filter(movie => movie.rating >= parseFloat(ratingFilter)); // Filter by minimum rating
    }
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating); // Sort by rating
    } else if (sortBy === "duration") {
      result.sort((a, b) => b.duration - a.duration); // Sort by duration
    }
    setFilteredMovies(result); // Update filtered movies
    setCurrentPage(1); // Reset to first page
  }, [movies, nameFilter, genreFilter, ratingFilter, sortBy]);

  const pageSize = 10; // Number of movies per page
  const pageCount = Math.ceil(filteredMovies.length / pageSize); // Total pages
  const currentMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize); // Movies for current page

  const handleBook = (movie, showTime) => {
    setBookingModal({ movie, showTime, tickets: 1 }); // Open booking modal with movie details
  };

  const confirmBooking = () => {
    const { movie, showTime, tickets } = bookingModal;
    // Update available seats after booking
    const updatedMovies = movies.map(m => {
      if (m.id === movie.id) {
        const updatedShowTimes = m.showTimes.map(st => {
          if (st.time === showTime.time) {
            return { ...st, availableSeats: st.availableSeats - tickets }; // Decrease available seats
          }
          return st;
        });
        return { ...m, showTimes: updatedShowTimes }; // Update show times
      }
      return m;
    });
    setMovies(updatedMovies); // Save updated movies
    setBookings([...bookings, { ...bookingModal, id: Date.now() }]); // Add booking to list
    setSuccessDetails({
      movieName: movie.name,
      showTime: showTime.time,
      tickets,
      totalPrice: tickets * showTime.price, // Calculate total price
    });
    setBookingModal(null); // Close booking modal
  };

  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId)); // Remove booking by ID
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tab navigation for Movies and Bookings */}
      <Tabs defaultValue="movies">
        <TabsList className="mb-4">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        {/* Movies Tab */}
        <TabsContent value="movies">
          {/* Filters and sorting */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Input
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)} // Handle name filter
              className="w-full sm:w-auto"
            />
            <Select onValueChange={setGenreFilter} value={genreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {["Action", "Comedy", "Drama", "Sci-Fi", "Horror"].map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem> // Genre filter options
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Min Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)} // Handle rating filter
              min="0"
              max="5"
              step="0.1"
              className="w-full"
            />
            <Select onValueChange={setSortBy} value={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Movie Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Ticket Price</TableHead>
                <TableHead>Available Seats</TableHead>
                <TableHead>Show Times</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMovies.map(movie => (
                <TableRow key={movie.id}>
                  {/* Display movie details */}
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>
                    ${Math.min(...movie.showTimes.map(showTime => showTime.price))} {/* Lowest ticket price */}
                  </TableCell>
                  <TableCell>
                    {Math.max(...movie.showTimes.map(showTime => showTime.availableSeats))} {/* Max available seats */}
                  </TableCell>
                  <TableCell>
                    {movie.showTimes.map(showTime => (
                      <div key={showTime.time} className="mb-2">
                        <Badge>{showTime.time}</Badge> {/* Show times */}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {/* Booking button */}
                    <Button size="sm" onClick={() => handleBook(movie, showTime)} className="ml-2">
                      Book Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)} // Change current page
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          {bookings.map(booking => (
            <Card key={booking.id} className="mb-4">
              <CardHeader>
                <CardTitle>{booking.movie.name}</CardTitle> {/* Booking movie name */}
              </CardHeader>
              <CardContent>
                <p>Showtime: {booking.showTime.time}</p>
                <p>Tickets: {booking.tickets}</p>
                <p>Total Price: ${booking.tickets * booking.showTime.price}</p>
                <Button onClick={() => cancelBooking(booking.id)} className="mt-2">Cancel Booking</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      {bookingModal && (
        <Dialog open={!!bookingModal} onOpenChange={() => setBookingModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Tickets for {bookingModal.movie.name}</DialogTitle>
            </DialogHeader>
            <div>
              <p>Showtime: {bookingModal.showTime.time}</p>
              <p>Price per ticket: ${bookingModal.showTime.price}</p>
              {/* Ticket count input */}
              <Input
                type="number"
                value={bookingModal.tickets}
                onChange={(e) => setBookingModal({ ...bookingModal, tickets: parseInt(e.target.value) || 1 })}
                min="1"
                max={bookingModal.showTime.availableSeats}
                className="mt-2"
              />
              <p className="mt-2">Total Price: ${bookingModal.tickets * bookingModal.showTime.price}</p>
            </div>
            <DialogFooter>
              <Button onClick={confirmBooking}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Details Modal */}
      {successDetails && (
        <Dialog open={!!successDetails} onOpenChange={() => setSuccessDetails(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Confirmed</DialogTitle>
            </DialogHeader>
            <div>
              <p>Movie Name: {successDetails.movieName}</p>
              <p>Showtime: {successDetails.showTime}</p>
              <p>Tickets: {successDetails.tickets}</p>
              <p>Total Price: ${successDetails.totalPrice}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setSuccessDetails(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
