import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample bus data
const sampleBuses = [
  {
    id: 1,
    name: "Express 1",
    totalSeats: 40,
    availableSeats: 30,
    bookedSeats: 10,
    ticketPrice: 50,
    travelTime: "4h",
    source: "New York",
    destination: "Boston",
    date: "2023-07-01",
  },
  {
    id: 2,
    name: "Express 2",
    totalSeats: 240,
    availableSeats: 120,
    bookedSeats: 120,
    ticketPrice: 150,
    travelTime: "2h",
    source: "New York",
    destination: "Boston",
    date: "2023-07-01",
  },
  // ... Add 19 more sample buses here
];

export default function App() {
  const [buses, setBuses] = useState(sampleBuses);
  const [bookings, setBookings] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [activeTab, setActiveTab] = useState("buses");
  const [filters, setFilters] = useState({ source: "", destination: "", date: "" });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    age: "",
    address: "",
    isSeniorCitizen: false,
    seatQuantity: 1,
    date: "",
    busId: null,
  });

  // Filter and sort buses
  const filteredBuses = useMemo(() => {
    let result = buses;
    if (filters.source) result = result.filter(bus => bus.source.toLowerCase().includes(filters.source.toLowerCase()));
    if (filters.destination) result = result.filter(bus => bus.destination.toLowerCase().includes(filters.destination.toLowerCase()));
    if (filters.date) result = result.filter(bus => bus.date === filters.date);
    if (sortBy) {
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [buses, filters, sortBy, sortOrder]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Book a ticket
  const bookTicket = () => {
    const bus = buses.find(b => b.id === bookingForm.busId);
    if (!bus || bus.availableSeats < bookingForm.seatQuantity) return;

    const price = bus.ticketPrice * bookingForm.seatQuantity;
    const discount = bookingForm.isSeniorCitizen ? 0.2 : 0;
    const totalPrice = price * (1 - discount);

    if (balance < totalPrice) return;

    setBalance(balance - totalPrice);
    setBookings([...bookings, { ...bookingForm, price: totalPrice }]);
    setBuses(buses.map(b => b.id === bus.id ? { ...b, availableSeats: b.availableSeats - bookingForm.seatQuantity, bookedSeats: b.bookedSeats + bookingForm.seatQuantity } : b));
    setBookingForm({ name: "", age: "", address: "", isSeniorCitizen: false, seatQuantity: 1, date: "", busId: null });
  };

  // Cancel booking
  const cancelBooking = (index) => {
    const booking = bookings[index];
    const bus = buses.find(b => b.id === booking.busId);
    setBalance(balance + booking.price);
    setBuses(buses.map(b => b.id === bus.id ? { ...b, availableSeats: b.availableSeats + booking.seatQuantity, bookedSeats: b.bookedSeats - booking.seatQuantity } : b));
    setBookings(bookings.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bus Booking System</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="buses">
          <Card>
            <CardHeader>
              <CardTitle>Available Buses</CardTitle>
              <CardDescription>Filter and sort buses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Input placeholder="Source" value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} />
                <Input placeholder="Destination" value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} />
                <Input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus Name</TableHead>
                    <TableHead onClick={() => handleSort("totalSeats")}>Total Seats</TableHead>
                    <TableHead onClick={() => handleSort("availableSeats")}>Available Seats</TableHead>
                    <TableHead onClick={() => handleSort("bookedSeats")}>Booked Seats</TableHead>
                    <TableHead onClick={() => handleSort("ticketPrice")}>Ticket Price</TableHead>
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
                      <TableCell>{bus.name}</TableCell>
                      <TableCell>{bus.totalSeats}</TableCell>
                      <TableCell>{bus.availableSeats}</TableCell>
                      <TableCell>{bus.bookedSeats}</TableCell>
                      <TableCell>${bus.ticketPrice}</TableCell>
                      <TableCell>{bus.travelTime}</TableCell>
                      <TableCell>{bus.source}</TableCell>
                      <TableCell>{bus.destination}</TableCell>
                      <TableCell>{bus.date}</TableCell>
                      <TableCell>
                        <Button onClick={() => setBookingForm({ ...bookingForm, busId: bus.id, date: bus.date })} disabled={bus.availableSeats === 0}>Book</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {bookingForm.busId && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Book a Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" value={bookingForm.age} onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={bookingForm.address} onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="senior" checked={bookingForm.isSeniorCitizen} onCheckedChange={(checked) => setBookingForm({ ...bookingForm, isSeniorCitizen: checked })} />
                    <Label htmlFor="senior">Senior Citizen</Label>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Seat Quantity</Label>
                    <Input id="quantity" type="number" min="1" value={bookingForm.seatQuantity} onChange={(e) => setBookingForm({ ...bookingForm, seatQuantity: parseInt(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={bookTicket}>Book Ticket</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>Balance: ${balance}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{booking.age}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>${booking.price}</TableCell>
                      <TableCell>
                        <Button onClick={() => cancelBooking(index)}>Cancel</Button>
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