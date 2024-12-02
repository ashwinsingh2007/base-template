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
  Label, 
  Select, 
  Option,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui";

const sampleBuses = [
  // Sample bus data would be listed here, for brevity, let's assume it's populated.
];

export default function App() {
  const [buses, setBuses] = useState(sampleBuses);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({ source: '', destination: '', date: '' });
  const [userBalance, setUserBalance] = useState(10000);
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Sorting function
  const sortedBuses = React.useMemo(() => {
    let sortableBuses = [...buses];
    if (sortConfig !== null) {
      sortableBuses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableBuses.filter(bus => 
      bus.source.toLowerCase().includes(filters.source.toLowerCase()) &&
      bus.destination.toLowerCase().includes(filters.destination.toLowerCase()) &&
      bus.date.includes(filters.date)
    );
  }, [buses, sortConfig, filters]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const [bookingForm, setBookingForm] = useState({ 
    busId: '', name: '', age: '', address: '', senior: false, seats: 1, date: '' 
  });

  const handleBooking = (bus) => {
    setBookingForm({ busId: bus.id, date: bus.date, seats: 1 });
  };

  const submitBooking = () => {
    const totalPrice = bookingForm.seats * buses.find(b => b.id === bookingForm.busId).ticketPrice * (bookingForm.senior ? 0.8 : 1);
    if (userBalance >= totalPrice && bookingForm.seats <= buses.find(b => b.id === bookingForm.busId).availableSeats) {
      setBookings(prev => [...prev, { ...bookingForm, price: totalPrice }]);
      setUserBalance(userBalance - totalPrice);
      // Update bus availability
      setBuses(buses.map(bus => 
        bus.id === bookingForm.busId ? { ...bus, availableSeats: bus.availableSeats - bookingForm.seats } : bus
      ));
    }
  };

  const cancelBooking = (id) => {
    const booking = bookings.find(b => b.busId === id);
    setUserBalance(userBalance + booking.price);
    setBookings(bookings.filter(b => b.busId !== id));
    // Update bus availability on cancellation
    setBuses(buses.map(bus => 
      bus.id === id ? { ...bus, availableSeats: bus.availableSeats + booking.seats } : bus
    ));
  };

  const [currentTab, setCurrentTab] = useState('buses');

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Bus Booking System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setCurrentTab('buses')}>Buses</Button>
            <Button onClick={() => setCurrentTab('bookings')}>My Bookings</Button>
          </div>
          {currentTab === 'buses' && (
            <>
              <div className="mb-4">
                <Input name="source" placeholder="Source" onChange={handleFilterChange} value={filters.source} />
                <Input name="destination" placeholder="Destination" onChange={handleFilterChange} value={filters.destination} className="ml-2" />
                <Input type="date" name="date" onChange={handleFilterChange} value={filters.date} className="ml-2" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {['Bus Name', 'Total Seats', 'Available Seats', 'Booked Seats', 'Price', 'Time', 'Action'].map((header) => (
                      <TableHead key={header} className="cursor-pointer" onClick={() => requestSort(header.toLowerCase().replace(' ', '_'))}>
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBuses.map(bus => (
                    <TableRow key={bus.id}>
                      {['name', 'total_seats', 'available_seats', 'booked_seats', 'ticket_price', 'travel_time'].map(key => (
                        <TableCell key={key}>{bus[key]}</TableCell>
                      ))}
                      <TableCell>
                        <Button onClick={() => handleBooking(bus)} disabled={bus.available_seats === 0}>Book</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {bookingForm.busId && (
                <div className="mt-4">
                  <Card>
                    <CardTitle>Book Your Ticket</CardTitle>
                    <CardContent>
                      <Input name="name" placeholder="Name" onChange={(e) => setBookingForm({...bookingForm, [e.target.name]: e.target.value})} />
                      <Input name="age" type="number" placeholder="Age" onChange={(e) => setBookingForm({...bookingForm, [e.target.name]: e.target.value})} />
                      <Input name="address" placeholder="Address" onChange={(e) => setBookingForm({...bookingForm, [e.target.name]: e.target.value})} />
                      <Checkbox checked={bookingForm.senior} onCheckedChange={(checked) => setBookingForm({...bookingForm, senior: checked})}>Senior Citizen?</Checkbox>
                      <Input type="number" name="seats" placeholder="Number of Seats" onChange={(e) => setBookingForm({...bookingForm, [e.target.name]: e.target.value})} value={bookingForm.seats} />
                    </CardContent>
                    <CardFooter>
                      <Button onClick={submitBooking}>Confirm Booking</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </>
          )}
          {currentTab === 'bookings' && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking.busId}>
                      <TableCell><Checkbox checked={selectedBookings.includes(booking.busId)} onChange={() => {
                        if (selectedBookings.includes(booking.busId)) {
                          setSelectedBookings(selectedBookings.filter(id => id !== booking.busId));
                        } else {
                          setSelectedBookings([...selectedBookings, booking.busId]);
                        }
                      }} /></TableCell>
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{buses.find(b => b.id === booking.busId)?.name}</TableCell>
                      <TableCell>{booking.seats}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell><Button onClick={() => cancelBooking(booking.busId)}>Cancel</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={() => selectedBookings.forEach(cancelBooking)}>Cancel Selected</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          Your Balance: ${userBalance}
        </CardFooter>
      </Card>
    </div>
  );
}