import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  Button, 
  Input, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/shadcn-ui";

// Dummy data generator
const generateMovies = () => {
  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'];
  const times = ['2:00 PM', '5:30 PM', '8:00 PM'];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Movie ${i + 1}`,
    genre: genres[Math.floor(Math.random() * genres.length)],
    duration: `${Math.floor(Math.random() * 120) + 60} min`,
    rating: (Math.random() * 5).toFixed(1),
    showTimes: times.map(time => ({
      time,
      price: (Math.random() * 10 + 10).toFixed(2),
      availableSeats: Math.floor(Math.random() * 50) + 10
    }))
  }));
};

const MOVIES = generateMovies();

function App() {
  const [movies, setMovies] = useState(MOVIES);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'rating', order: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookings, setBookings] = useState([]);

  // Filtering and sorting logic
  const filteredMovies = movies.filter(movie => 
    movie.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterGenre === '' || movie.genre === filterGenre)
  ).sort((a, b) => {
    if (sortBy.field === 'rating' || sortBy.field === 'duration') {
      return sortBy.order === 'asc' ? 
        parseFloat(a[sortBy.field]) - parseFloat(b[sortBy.field]) : 
        parseFloat(b[sortBy.field]) - parseFloat(a[sortBy.field]);
    }
    return 0;
  });

  const moviesPerPage = 10;
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  const handleBooking = () => {
    const updatedMovies = movies.map(m => {
      if (m.id === selectedMovie.id) {
        return {
          ...m,
          showTimes: m.showTimes.map(st => 
            st.time === selectedShowTime ? { ...st, availableSeats: st.availableSeats - ticketCount } : st
          )
        };
      }
      return m;
    });
    setMovies(updatedMovies);
    setBookings([...bookings, {
      movieName: selectedMovie.name,
      showTime: selectedShowTime,
      tickets: ticketCount,
      totalPrice: (selectedMovie.showTimes.find(t => t.time === selectedShowTime).price * ticketCount).toFixed(2)
    }]);
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="movies" className="w-full">
        <TabsList>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="movies">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between">
            <Input 
              placeholder="Filter by movie name" 
              value={filterName} 
              onChange={(e) => setFilterName(e.target.value)} 
              className="mb-2 sm:mb-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Genre</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterGenre('')}>All</DropdownMenuItem>
                {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'].map(genre => (
                  <DropdownMenuItem key={genre} onClick={() => setFilterGenre(genre)}>{genre}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy({ field: 'rating', order: 'desc' })}>Rating (High to Low)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy({ field: 'rating', order: 'asc' })}>Rating (Low to High)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy({ field: 'duration', order: 'desc' })}>Duration (Long to Short)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy({ field: 'duration', order: 'asc' })}>Duration (Short to Long)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMovies.map(movie => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration}</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>
                    {movie.showTimes.map(show => (
                      <Button 
                        key={show.time} 
                        className="mb-1 mr-1" 
                        onClick={() => {
                          setSelectedMovie(movie);
                          setSelectedShowTime(show.time);
                          setModalOpen(true);
                        }}
                      >
                        {show.time}
                      </Button>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            total={Math.ceil(filteredMovies.length / moviesPerPage)}
            currentPage={currentPage}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4"
          />
        </TabsContent>
        <TabsContent value="bookings">
          {bookings.map((booking, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{booking.movieName}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <p>Show Time: {booking.showTime}</p>
                  <p>Tickets: {booking.tickets}</p>
                  <p>Total Price: ${booking.totalPrice}</p>
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  const updatedBookings = bookings.filter((_, i) => i !== index);
                  setBookings(updatedBookings);
                }}>Cancel Booking</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Book Tickets</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Movie: {selectedMovie?.name}</p>
            <p>Time: {selectedShowTime}</p>
            <Input 
              type="number" 
              min="1" 
              max={selectedMovie?.showTimes.find(t => t.time === selectedShowTime)?.availableSeats} 
              value={ticketCount} 
              onChange={(e) => setTicketCount(Number(e.target.value))} 
              className="mt-2"
            />
            <p>Total Price: ${(selectedMovie?.showTimes.find(t => t.time === selectedShowTime)?.price * ticketCount).toFixed(2)}</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleBooking}>Confirm Booking</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;