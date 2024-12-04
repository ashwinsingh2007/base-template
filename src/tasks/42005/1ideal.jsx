
// Import necessary React hooks and components
import React, { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
} from "@/components/ui/table"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
} from "@/components/ui/select"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
} from "@/components/ui/dialog"; 

// Sample data for buses
const sampleBuses = Array.from({ length: 20 }, (_, i) => ({ 
  id: i + 1, 
  name: `Bus ${i + 1}`, 
  date: `2023-07-${String((i % 31) + 1).padStart(2, "0")}`, 
  totalSeats: 40 + i * 5, 
  availableSeats: 20 + i, 
  bookedSeats: 20 - i, 
  price: 100 + i * 10, 
  travelTime: 120 + i * 5, 
  source: `City ${i % 5 + 1}`, 
  destination: `City ${i % 5 + 2}`, 
})); 

// BookingForm component handles the ticket booking process
const BookingForm = ({ bus, onBook, onClose }) => { 
  const [name, setName] = useState(""); // Stores the name of the passenger
  const [age, setAge] = useState(""); // Stores the age of the passenger
  const [address, setAddress] = useState(""); // Stores the address of the passenger
  const [isSenior, setIsSenior] = useState(false); // Indicates if the passenger is a senior citizen
  const [quantity, setQuantity] = useState(1); // Stores the number of tickets

  // Handles the form submission
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onBook({ name, age, address, isSenior, quantity, busId: bus.id, date: bus.date }); 
    onClose(); 
  }; 

  return ( 
    <form onSubmit={handleSubmit} className="space-y-4"> 
      {/* Input for name */}
      <Input 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      /> 
      {/* Input for age */}
      <Input 
        type="number" 
        placeholder="Age" 
        value={age} 
        onChange={(e) => setAge(e.target.value)} 
        required 
      /> 
      {/* Input for address */}
      <Input 
        placeholder="Address" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)} 
        required 
      /> 
      {/* Checkbox for senior citizen */}
      <div className="flex items-center space-x-2"> 
        <Checkbox id="senior" checked={isSenior} onCheckedChange={setIsSenior} /> 
        <label htmlFor="senior">Senior Citizen</label> 
      </div> 
      {/* Input for ticket quantity */}
      <Input 
        type="number" 
        placeholder="Quantity" 
        min="1" 
        max={bus.availableSeats} 
        value={quantity} 
        onChange={(e) => setQuantity(parseInt(e.target.value))} 
        required 
      /> 
      {/* Submit button */}
      <Button type="submit" className="bg-green-500 hover:bg-green-600"> 
        Book 
      </Button> 
    </form> 
  ); 
}; 

// Pagination component for navigating paginated lists
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => { 
  const totalPages = Math.ceil(totalItems / itemsPerPage); 

  return ( 
    <div className="flex justify-between items-center mt-4"> 
      {/* Button for previous page */}
      <Button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)} 
        className="bg-blue-500 hover:bg-blue-600" 
      > 
        Previous 
      </Button> 
      {/* Current page info */}
      <span> 
        Page {currentPage} of {totalPages} 
      </span> 
      {/* Button for next page */}
      <Button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)} 
        className="bg-blue-500 hover:bg-blue-600" 
      > 
        Next 
      </Button> 
    </div> 
  ); 
}; 

// Main App component
export default function App() { 
  const [buses, setBuses] = useState(sampleBuses); // Stores all buses
  const [filteredBuses, setFilteredBuses] = useState(buses); // Stores filtered buses
  const [bookings, setBookings] = useState([]); // Stores all bookings
  const [balance, setBalance] = useState(10000); // Stores the user's current balance
  const [sourceFilter, setSourceFilter] = useState(""); // Filter by source city
  const [destinationFilter, setDestinationFilter] = useState(""); // Filter by destination city
  const [dateFilter, setDateFilter] = useState(""); // Filter by travel date
  const [currentBusPage, setCurrentBusPage] = useState(1); // Current page for buses
  const [currentBookingPage, setCurrentBookingPage] = useState(1); // Current page for bookings

  const ITEMS_PER_PAGE = 5; // Number of items per page

  // Updates the filtered buses list when filters change
  useEffect(() => { 
    let filtered = buses; 
    if (sourceFilter) filtered = filtered.filter((b) => b.source === sourceFilter); 
    if (destinationFilter) 
      filtered = filtered.filter((b) => b.destination === destinationFilter); 
    if (dateFilter) filtered = filtered.filter((b) => b.date === dateFilter); 
    setFilteredBuses(filtered); 
  }, [buses, sourceFilter, destinationFilter, dateFilter]); 

  // Handles a successful booking
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

  // Slices the filtered buses for pagination
  const busesToShow = filteredBuses.slice( 
    (currentBusPage - 1) * ITEMS_PER_PAGE, 
    currentBusPage * ITEMS_PER_PAGE 
  ); 

  // Slices the bookings for pagination
  const bookingsToShow = bookings.slice( 
    (currentBookingPage - 1) * ITEMS_PER_PAGE, 
    currentBookingPage * ITEMS_PER_PAGE 
  ); 

  return ( 
    <div className="container mx-auto p-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
      {/* App Header */}
      <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6"> 
        Bus Booking System 
      </h1> 
      {/* Display User Balance */}
      <p className="text-lg font-medium mb-4">Balance: ${balance}</p> 
      {/* Tabs for buses and bookings */}
      <Tabs defaultValue="buses"> 
        <TabsList className="mb-4"> 
          <TabsTrigger value="buses">Buses</TabsTrigger> 
          <TabsTrigger value="bookings">Bookings</TabsTrigger> 
        </TabsList> 
        {/* Tab content for buses */}
        <TabsContent value="buses"> 
          <Card> 
            <CardHeader> 
              <CardTitle className="text-indigo-600">Available Buses</CardTitle> 
            </CardHeader> 
            <CardContent> 
              {/* Filters */}
              <div className="flex space-x-2 mb-4"> 
                {/* Source filter */}
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
                {/* Destination filter */}
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
                {/* Date filter */}
                <Input 
                  type="date" 
                  placeholder="Date" 
                  onChange={(e) => setDateFilter(e.target.value)} 
                /> 
              </div> 
              {/* Bus list */}
              <Table className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100"> 
                <TableHeader> 
                  <TableRow className="bg-indigo-500"> 
                    <TableHead className="text-white">Bus ID</TableHead> 
                    <TableHead className="text-white">Bus Name</TableHead> 
                    <TableHead className="text-white">Total Seats</TableHead> 
                    <TableHead className="text-white">Available Seats</TableHead> 
                    <TableHead className="text-white">Booked Seats</TableHead> 
                    <TableHead className="text-white">Price</TableHead> 
                    <TableHead className="text-white">Travel Time</TableHead> 
                    <TableHead className="text-white">Source</TableHead> 
                    <TableHead className="text-white">Destination</TableHead> 
                    <TableHead className="text-white">Date</TableHead> 
                    <TableHead className="text-white">Action</TableHead> 
                  </TableRow> 
                </TableHeader> 
                <TableBody> 
                  {busesToShow.map((bus) => ( 
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
                        {/* Booking action */}
                        <Dialog> 
                          <DialogTrigger asChild> 
                            <Button 
                              disabled={bus.availableSeats === 0} 
                              className="bg-green-500 hover:bg-green-600" 
                            > 
                              Book 
                            </Button> 
                          </DialogTrigger> 
                          <DialogContent> 
                            <DialogHeader> 
                              <DialogTitle>Book Bus Ticket</DialogTitle> 
                            </DialogHeader> 
                            <BookingForm bus={bus} onBook={handleBook} /> 
                          </DialogContent> 
                        </Dialog> 
                      </TableCell> 
                    </TableRow> 
                  ))} 
                </TableBody> 
              </Table> 
              {/* Pagination for buses */}
              <Pagination 
                currentPage={currentBusPage} 
                totalItems={filteredBuses.length} 
                itemsPerPage={ITEMS_PER_PAGE} 
                onPageChange={setCurrentBusPage} 
              /> 
            </CardContent> 
          </Card> 
        </TabsContent> 
        {/* Tab content for bookings */}
        <TabsContent value="bookings"> 
          <Card> 
            <CardHeader> 
              <CardTitle className="text-indigo-600">Your Bookings</CardTitle> 
            </CardHeader> 
            <CardContent> 
              {/* Booking list */}
              <Table> 
                <TableHeader> 
                  <TableRow> 
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
                  {bookingsToShow.map((booking) => ( 
                    <TableRow key={booking.busId}> 
                      <TableCell>{booking.name}</TableCell> 
                      <TableCell>{booking.age}</TableCell> 
                      <TableCell>{booking.address}</TableCell> 
                      <TableCell>{booking.isSenior ? "Yes" : "No"}</TableCell> 
                      <TableCell>{booking.quantity}</TableCell> 
                      <TableCell>{booking.date}</TableCell> 
                      <TableCell>${booking.price}</TableCell> 
                      <TableCell> 
                        {/* Cancel booking */}
                        <Button className="bg-red-500 hover:bg-red-600">Cancel</Button> 
                      </TableCell> 
                    </TableRow> 
                  ))} 
                </TableBody> 
              </Table> 
              {/* Pagination for bookings */}
              <Pagination 
                currentPage={currentBookingPage} 
                totalItems={bookings.length} 
                itemsPerPage={ITEMS_PER_PAGE} 
                onPageChange={setCurrentBookingPage} 
              /> 
            </CardContent> 
          </Card> 
        </TabsContent> 
      </Tabs> 
    </div> 
  ); 
} 

