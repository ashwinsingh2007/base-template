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

// Sample bus data for demonstration purposes
const sampleBuses = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Bus ${i + 1}`, // Unique name for each bus
    date: `2023-07-${String((i % 31) + 1).padStart(2, "0")}`, // Dates distributed over July
    totalSeats: 40 + i * 5, // Increasing seat count for each bus
    availableSeats: 20 + i, // Increasing available seats for variety
    bookedSeats: 20 - i, // Decreasing booked seats for variety
    price: 100 + i * 10, // Incremental pricing for each bus
    travelTime: 120 + i * 5, // Incremental travel time in minutes
    source: `City ${i % 5 + 1}`, // Rotate between 5 source cities
    destination: `City ${i % 5 + 2}`, // Rotate between 5 destination cities
  }));

// BookingForm component to handle booking details input
const BookingForm = ({ bus, onBook, onClose }) => {
  const [name, setName] = useState(""); // Passenger's name
  const [age, setAge] = useState(""); // Passenger's age
  const [address, setAddress] = useState(""); // Passenger's address
  const [isSenior, setIsSenior] = useState(false); // Senior citizen status
  const [quantity, setQuantity] = useState(1); // Number of tickets to book

  // Handle form submission for booking
  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ name, age, address, isSenior, quantity, busId: bus.id, date: bus.date });
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
        max={bus.availableSeats} // Limit quantity to available seats
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
  // State management for buses, bookings, filters, and UI interactions
  const [buses, setBuses] = useState(sampleBuses); // All bus data
  const [filteredBuses, setFilteredBuses] = useState(buses); // Filtered bus data
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

  // The rest of the logic and functionality remains unchanged, except for renaming variables from "train" to "bus".
  useEffect(() => {
    let filtered = buses;
    if (sourceFilter) filtered = filtered.filter((b) => b.source === sourceFilter);
    if (destinationFilter) filtered = filtered.filter((b) => b.destination === destinationFilter);
    if (dateFilter) filtered = filtered.filter((b) => b.date === dateFilter);
    setFilteredBuses(filtered);
  }, [buses, sourceFilter, destinationFilter, dateFilter]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    const sorted = [...filteredBuses].sort((a, b) => {
      if (a[column] < b[column]) return sortOrder === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredBuses(sorted);
  };

  const handleBook = (bookingData) => {
    const bus = buses.find((b) => b.id === bookingData.busId);
    const totalPrice = bus.price * bookingData.quantity * (bookingData.isSenior ? 0.8 : 1);
    if (balance >= totalPrice && bus.availableSeats >= bookingData.quantity) {
      setBalance(balance - totalPrice);
      setBookings([...bookings, { ...bookingData, price: totalPrice }]);
      setBuses(
        buses.map((b) =>
          b.id === bus.id
            ? {
                ...b,
                availableSeats: b.availableSeats - bookingData.quantity,
                bookedSeats: b.bookedSeats + bookingData.quantity,
              }
            : b
        )
      );
    } else {
      alert("Booking failed. Insufficient balance or seats.");
    }
  };

  const handleCancel = (bookingToCancel) => {
    setBalance(balance + bookingToCancel.price);
    setBookings(bookings.filter((b) => b !== bookingToCancel));
    setBuses(
      buses.map((b) =>
        b.id === bookingToCancel.busId
          ? {
              ...b,
              availableSeats: b.availableSeats + bookingToCancel.quantity,
              bookedSeats: b.bookedSeats - bookingToCancel.quantity,
            }
          : b
      )
    );
  };

  const handleMultiCancel = () => {
    selectedBookings.forEach(handleCancel);
    setSelectedBookings([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bus Booking System</h1>
      <p className="mb-4">Balance: ${balance}</p>
      <Tabs defaultValue="buses">
        <TabsList>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="buses">
          <Card>
            <CardHeader>
              <CardTitle>Available Buses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Select onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(buses.map((b) => b.source))).map((source) => (
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
                    {Array.from(new Set(buses.map((b) => b.destination))).map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Date" onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus ID</TableHead>
                    <TableHead>Bus Name</TableHead>
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
                  {filteredBuses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell>{bus.id}</TableCell>
                      <TableCell>{bus.name}</TableCell>
                      <TableCell>{bus.totalSeats}</TableCell>
                      <TableCell>{bus.availableSeats}</TableCell>
                      <TableCell>{bus.bookedSeats}</TableCell>
                      <TableCell>${bus.price}</TableCell>
                      <TableCell>{bus.travelTime} mins</TableCell>
                      <TableCell>{bus.source}</TableCell>
                      <TableCell>{bus.destination}</TableCell>
                      <TableCell>{bus.date}</TableCell>
                      <TableCell>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button disabled={bus.availableSeats === 0}>Book</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Book Bus Ticket</DialogTitle>
                            </DialogHeader>
                            <BookingForm bus={bus} onBook={handleBook} onClose={() => setDialogOpen(false)} />
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
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input type="date" placeholder="Filter by Date" onChange={(e) => setDateFilter(e.target.value)} />
                <Input placeholder="Filter by Name" onChange={(e) => setNameFilter(e.target.value)} />
              </div>
              <Button onClick={handleMultiCancel} disabled={selectedBookings.length === 0}>
                Cancel Selected
              </Button>
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
                      <TableRow key={booking.busId}>
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
