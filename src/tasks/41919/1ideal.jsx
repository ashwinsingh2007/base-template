import React, { useState, useEffect } from "react";
// Import necessary UI components for building the interface
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample train data for demonstration purposes
const sampleTrains = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Train ${i + 1}`, // Unique name for each train
    date: `2023-07-${String((i % 31) + 1).padStart(2, "0")}`, // Dates distributed over July
    totalSeats: 100 + i * 10, // Increasing seat count for each train
    availableSeats: 50 + i, // Increasing available seats for variety
    bookedSeats: 50 - i, // Decreasing booked seats for variety
    price: 50 + i * 5, // Incremental pricing for each train
    travelTime: 100 + i * 10, // Incremental travel time
    source: `City ${i % 5 + 1}`, // Rotate between 5 source cities
    destination: `City ${i % 5 + 2}`, // Rotate between 5 destination cities
  }));
  
// BookingForm component to handle booking details input
const BookingForm = ({ train, onBook, onClose }) => {
  const [name, setName] = useState(""); // Passenger's name
  const [age, setAge] = useState(""); // Passenger's age
  const [address, setAddress] = useState(""); // Passenger's address
  const [isSenior, setIsSenior] = useState(false); // Senior citizen status
  const [quantity, setQuantity] = useState(1); // Number of tickets to book

  // Handle form submission for booking
  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ name, age, address, isSenior, quantity, trainId: train.id, date: train.date });
    onClose(); // Close the booking dialog after successful booking
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields for passenger details */}
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
      <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <div className="flex items-center space-x-2">
        <Checkbox id="senior" checked={isSenior} onCheckedChange={setIsSenior} />
        <label htmlFor="senior">Senior Citizen</label>
      </div>
      <Input
        type="number"
        placeholder="Quantity"
        min="1"
        max={train.availableSeats} // Limit quantity to available seats
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        required
      />
      <Button type="submit">Book</Button>
    </form>
  );
};

// Main App component
export default function App() {
  // State management for trains, bookings, filters, and UI interactions
  const [trains, setTrains] = useState(sampleTrains); // All train data
  const [filteredTrains, setFilteredTrains] = useState(trains); // Filtered train data
  const [bookings, setBookings] = useState([]); // User's bookings
  const [balance, setBalance] = useState(10000); // User's account balance
  const [sortColumn, setSortColumn] = useState(null); // Column to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order
  const [sourceFilter, setSourceFilter] = useState(""); // Source filter
  const [destinationFilter, setDestinationFilter] = useState(""); // Destination filter
  const [dateFilter, setDateFilter] = useState(""); // Date filter
  const [nameFilter, setNameFilter] = useState(""); // Name filter for bookings
  const [selectedBookings, setSelectedBookings] = useState([]); // Selected bookings for cancellation
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state

  // Filter trains based on selected filters
  useEffect(() => {
    let filtered = trains;
    if (sourceFilter) filtered = filtered.filter((t) => t.source === sourceFilter);
    if (destinationFilter) filtered = filtered.filter((t) => t.destination === destinationFilter);
    if (dateFilter) filtered = filtered.filter((t) => t.date === dateFilter);
    setFilteredTrains(filtered);
  }, [trains, sourceFilter, destinationFilter, dateFilter]);

  // Handle sorting of train data
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    const sorted = [...filteredTrains].sort((a, b) => {
      if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTrains(sorted);
  };

  // Handle new booking logic
  const handleBook = (bookingData) => {
    const train = trains.find((t) => t.id === bookingData.trainId);
    const totalPrice = train.price * bookingData.quantity * (bookingData.isSenior ? 0.8 : 1); // Apply discount for seniors
    if (balance >= totalPrice && train.availableSeats >= bookingData.quantity) {
      setBalance(balance - totalPrice); // Deduct balance
      setBookings([...bookings, { ...bookingData, price: totalPrice }]); // Add booking
      setTrains(
        trains.map((t) =>
          t.id === train.id
            ? {
                ...t,
                availableSeats: t.availableSeats - bookingData.quantity,
                bookedSeats: t.bookedSeats + bookingData.quantity,
              }
            : t
        )
      );
    } else {
      alert("Booking failed. Insufficient balance or seats."); // Alert on failure
    }
  };

  // Handle booking cancellation
  const handleCancel = (bookingToCancel) => {
    setBalance(balance + bookingToCancel.price); // Refund balance
    setBookings(bookings.filter((b) => b !== bookingToCancel)); // Remove booking
    setTrains(
      trains.map((t) =>
        t.id === bookingToCancel.trainId
          ? {
              ...t,
              availableSeats: t.availableSeats + bookingToCancel.quantity,
              bookedSeats: t.bookedSeats - bookingToCancel.quantity,
            }
          : t
      )
    );
  };

  // Handle multiple bookings cancellation
  const handleMultiCancel = () => {
    selectedBookings.forEach(handleCancel); // Cancel selected bookings
    setSelectedBookings([]); // Clear selection
  };

  return (
    <div className="container mx-auto p-4">
      {/* App title and balance display */}
      <h1 className="text-3xl font-bold mb-4">Train Booking System</h1>
      <p className="mb-4">Balance: ${balance}</p>
      {/* Tabs for switching between trains and bookings views */}
      <Tabs defaultValue="trains">
        <TabsList>
          <TabsTrigger value="trains">Trains</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="trains">
          {/* Train details table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Trains</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters for trains */}
              <div className="flex space-x-2 mb-4">
                <Select onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(trains.map((t) => t.source))).map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setDestinationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(trains.map((t) => t.destination))).map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Date" onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              {/* Train list table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Train ID</TableHead>
                    <TableHead>Train Name</TableHead>
                    <TableHead onClick={() => handleSort("totalSeats")}>Total Seats</TableHead>
                    <TableHead onClick={() => handleSort("availableSeats")}>Available Seats</TableHead>
                    <TableHead onClick={() => handleSort("bookedSeats")}>Booked Seats</TableHead>
                    <TableHead onClick={() => handleSort("price")}>Price</TableHead>
                    <TableHead onClick={() => handleSort("travelTime")}>Travel Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrains.map((train) => (
                    <TableRow key={train.id}>
                      <TableCell>{train.id}</TableCell>
                      <TableCell>{train.name}</TableCell>
                      <TableCell>{train.totalSeats}</TableCell>
                      <TableCell>{train.availableSeats}</TableCell>
                      <TableCell>{train.bookedSeats}</TableCell>
                      <TableCell>${train.price}</TableCell>
                      <TableCell>{train.travelTime}</TableCell>
                      <TableCell>{train.source}</TableCell>
                      <TableCell>{train.destination}</TableCell>
                      <TableCell>{train.date}</TableCell>
                      <TableCell>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button disabled={train.availableSeats === 0}>Book</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Book Train Ticket</DialogTitle>
                            </DialogHeader>
                            <BookingForm train={train} onBook={handleBook} onClose={() => setDialogOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          {/* Bookings list */}
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters for bookings */}
              <div className="flex space-x-2 mb-4">
                <Input type="date" placeholder="Filter by Date" onChange={(e) => setDateFilter(e.target.value)} />
                <Input placeholder="Filter by Name" onChange={(e) => setNameFilter(e.target.value)} />
              </div>
              <Button onClick={handleMultiCancel} disabled={selectedBookings.length === 0}>
                Cancel Selected
              </Button>
              {/* Bookings table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Senior Citizen</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings
                    .filter((b) => (dateFilter ? b.date === dateFilter : true))
                    .filter((b) => (nameFilter ? b.name.toLowerCase().includes(nameFilter.toLowerCase()) : true))
                    .map((booking) => (
                      <TableRow key={booking.trainId}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBookings.includes(booking)}
                            onCheckedChange={(checked) => {
                              setSelectedBookings(
                                checked
                                  ? [...selectedBookings, booking]
                                  : selectedBookings.filter((b) => b !== booking)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.age}</TableCell>
                        <TableCell>{booking.address}</TableCell>
                        <TableCell>{booking.isSenior ? "Yes" : "No"}</TableCell>
                        <TableCell>{booking.quantity}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>${booking.price}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleCancel(booking)}>Cancel</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
