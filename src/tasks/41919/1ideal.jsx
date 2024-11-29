import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const sampleTrains = [
  {
    id: 1,
    name: "Express 101",
    date: "2023-07-01",
    totalSeats: 100,
    availableSeats: 50,
    bookedSeats: 50,
    price: 50,
    travelTime: 120,
    source: "New York",
    destination: "Boston",
  },
  {
    id: 2,
    name: "Cityline Express",
    date: "2023-07-02",
    totalSeats: 120,
    availableSeats: 80,
    bookedSeats: 40,
    price: 60,
    travelTime: 150,
    source: "Boston",
    destination: "Chicago",
  },
  // Add 18 more sample trains...
];

const BookingForm = ({ train, onBook, onClose }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [isSenior, setIsSenior] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({ name, age, address, isSenior, quantity, trainId: train.id, date: train.date });
    onClose(); // Close the booking dialog after successful booking
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        max={train.availableSeats}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        required
      />
      <Button type="submit">Book</Button>
    </form>
  );
};

export default function App() {
  const [trains, setTrains] = useState(sampleTrains);
  const [filteredTrains, setFilteredTrains] = useState(trains);
  const [bookings, setBookings] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sourceFilter, setSourceFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let filtered = trains;
    if (sourceFilter) filtered = filtered.filter((t) => t.source === sourceFilter);
    if (destinationFilter) filtered = filtered.filter((t) => t.destination === destinationFilter);
    if (dateFilter) filtered = filtered.filter((t) => t.date === dateFilter);
    setFilteredTrains(filtered);
  }, [trains, sourceFilter, destinationFilter, dateFilter]);

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

  const handleBook = (bookingData) => {
    const train = trains.find((t) => t.id === bookingData.trainId);
    const totalPrice = train.price * bookingData.quantity * (bookingData.isSenior ? 0.8 : 1);
    if (balance >= totalPrice && train.availableSeats >= bookingData.quantity) {
      setBalance(balance - totalPrice);
      setBookings([...bookings, { ...bookingData, price: totalPrice }]);
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
      alert("Booking failed. Insufficient balance or seats.");
    }
  };

  const handleCancel = (bookingToCancel) => {
    setBalance(balance + bookingToCancel.price);
    setBookings(bookings.filter((b) => b !== bookingToCancel));
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

  const handleMultiCancel = () => {
    selectedBookings.forEach(handleCancel);
    setSelectedBookings([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Train Booking System</h1>
      <p className="mb-4">Balance: ${balance}</p>
      <Tabs defaultValue="trains">
        <TabsList>
          <TabsTrigger value="trains">Trains</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="trains">
          <Card>
            <CardHeader>
              <CardTitle>Available Trains</CardTitle>
            </CardHeader>
            <CardContent>
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
