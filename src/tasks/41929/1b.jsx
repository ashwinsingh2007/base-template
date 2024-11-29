import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Generate dummy movie data
const generateMovies = () => {
  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"];
  const showTimes = ["2:00 PM", "5:30 PM", "8:00 PM"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Movie ${i + 1}`,
    genre: genres[Math.floor(Math.random() * genres.length)],
    duration: Math.floor(Math.random() * 60) + 90, // 90-150 minutes
    rating: (Math.random() * 5).toFixed(1),
    showTimes: showTimes.map(time => ({
      time,
      price: Math.floor(Math.random() * 10) + 10, // $10-$20
      availableSeats: Math.floor(Math.random() * 50) + 50, // 50-100 seats
    })),
  }));
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [bookingModal, setBookingModal] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setMovies(generateMovies());
  }, []);

  useEffect(() => {
    let result = movies;
    if (nameFilter) {
      result = result.filter(movie => movie.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (genreFilter) {
      result = result.filter(movie => movie.genre === genreFilter);
    }
    if (ratingFilter) {
      result = result.filter(movie => parseFloat(movie.rating) >= parseFloat(ratingFilter));
    }
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "duration") {
      result.sort((a, b) => b.duration - a.duration);
    }
    setFilteredMovies(result);
    setCurrentPage(1);
  }, [movies, nameFilter, genreFilter, ratingFilter, sortBy]);

  const pageSize = 10;
  const pageCount = Math.ceil(filteredMovies.length / pageSize);
  const currentMovies = filteredMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleBook = (movie, showTime) => {
    setBookingModal({ movie, showTime, tickets: 1 });
  };

  const confirmBooking = () => {
    const { movie, showTime, tickets } = bookingModal;
    const updatedMovies = movies.map(m => {
      if (m.id === movie.id) {
        const updatedShowTimes = m.showTimes.map(st => {
          if (st.time === showTime.time) {
            return { ...st, availableSeats: st.availableSeats - tickets };
          }
          return st;
        });
        return { ...m, showTimes: updatedShowTimes };
      }
      return m;
    });
    setMovies(updatedMovies);
    setBookings([...bookings, { ...bookingModal, id: Date.now() }]);
    setSuccessMessage(`Booked ${tickets} ticket(s) for ${movie.name} at ${showTime.time}`);
    setBookingModal(null);
  };

  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId));
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="movies">
        <TabsList className="mb-4">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="movies">
          <div className="mb-4 flex flex-wrap gap-2">
            <Input
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select value={genreFilter} onValueChange={setGenreFilter} className="w-full sm:w-auto">
              <option value="">All Genres</option>
              {["Action", "Comedy", "Drama", "Sci-Fi", "Horror"].map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Min Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              min="0"
              max="5"
              step="0.1"
              className="w-full sm:w-auto"
            />
            <Select value={sortBy} onValueChange={setSortBy} className="w-full sm:w-auto">
              <option value="">Sort By</option>
              <option value="rating">Rating</option>
              <option value="duration">Duration</option>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Show Times</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMovies.map(movie => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>
                    {movie.showTimes.map(showTime => (
                      <div key={showTime.time} className="mb-2">
                        <Badge>{showTime.time}</Badge>
                        <Button size="sm" onClick={() => handleBook(movie, showTime)} className="ml-2">
                          Book Now
                        </Button>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-center">
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          {bookings.map(booking => (
            <Card key={booking.id} className="mb-4">
              <CardHeader>
                <CardTitle>{booking.movie.name}</CardTitle>
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

      {bookingModal && (
        <Dialog open={!!bookingModal} onOpenChange={() => setBookingModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Tickets for {bookingModal.movie.name}</DialogTitle>
            </DialogHeader>
            <div>
              <p>Showtime: {bookingModal.showTime.time}</p>
              <p>Price per ticket: ${bookingModal.showTime.price}</p>
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

      {successMessage && (
        <Alert className="mt-4">
          <AlertTitle>Booking Confirmed</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}