import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectItem,
} from "@/components/ui";

const initialTrains = Array.from({ length: 20 }, (_, i) => ({
  id: `T${i + 1}`,
  name: `Train ${String.fromCharCode(65 + i)}`,
  from: `City ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
  to: `City ${String.fromCharCode(75 + Math.floor(Math.random() * 10))}`,
  totalSeats: 200,
  availableSeats: Math.floor(Math.random() * 200),
  bookedSeats: 0,
  price: Math.floor(Math.random() * 100) + 50,
  travelTime: `${Math.floor(Math.random() * 12) + 1} hrs`,
}));

export default function App() {
  const [trains, setTrains] = useState(initialTrains);
  const [userBalance, setUserBalance] = useState(10000);
  const [bookings, setBookings] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '', age: '', address: '', isSenior: false, seatQuantity: 1
  });

  const handleBooking = () => {
    if (!selectedTrain) return;
    const train = trains.find(t => t.id === selectedTrain);
    if (bookingForm.seatQuantity <= train.availableSeats && userBalance >= train.price * bookingForm.seatQuantity) {
      const newTrainState = trains.map(t => 
        t.id === selectedTrain ? { 
          ...t, 
          availableSeats: t.availableSeats - bookingForm.seatQuantity,
          bookedSeats: t.bookedSeats + bookingForm.seatQuantity 
        } : t
      );
      setTrains(newTrainState);
      const bookingCost = train.price * bookingForm.seatQuantity * (bookingForm.isSenior ? 0.8 : 1);
      setUserBalance(userBalance - bookingCost);
      setBookings([...bookings, {
        ...bookingForm, 
        trainId: selectedTrain, 
        cost: bookingCost,
        id: `B${Date.now()}`
      }]);
      setBookingForm({ name: '', age: '', address: '', isSenior: false, seatQuantity: 1 });
    } else {
      alert('Not enough seats or balance!');
    }
  };

  const cancelBooking = (bookingId) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (bookingToCancel) {
      const trainToUpdate = trains.find(t => t.id === bookingToCancel.trainId);
      const updatedTrain = {
        ...trainToUpdate,
        availableSeats: trainToUpdate.availableSeats + parseInt(bookingToCancel.seatQuantity),
        bookedSeats: trainToUpdate.bookedSeats - parseInt(bookingToCancel.seatQuantity)
      };
      setTrains(trains.map(t => t.id === bookingToCancel.trainId ? updatedTrain : t));
      setUserBalance(userBalance + bookingToCancel.cost);
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <Tabs defaultValue="book">
        <TabsList>
          <TabsTrigger value="book">Book Ticket</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="book">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Train</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedTrain}>
                <SelectItem value={null}>Select a Train</SelectItem>
                {trains.map(train => (
                  <SelectItem key={train.id} value={train.id}>
                    {train.name} - {train.from} to {train.to}
                  </SelectItem>
                ))}
              </Select>
              {selectedTrain && (
                <>
                  <Label>Name</Label>
                  <Input value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} />
                  <Label>Age</Label>
                  <Input type="number" value={bookingForm.age} onChange={e => setBookingForm({...bookingForm, age: e.target.value})} />
                  <Label>Address</Label>
                  <Input value={bookingForm.address} onChange={e => setBookingForm({...bookingForm, address: e.target.value})} />
                  <Label>Is Senior Citizen?</Label>
                  <Select onValueChange={value => setBookingForm({...bookingForm, isSenior: value === 'yes'})}>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </Select>
                  <Label>Seat Quantity</Label>
                  <Input type="number" value={bookingForm.seatQuantity} onChange={e => setBookingForm({...bookingForm, seatQuantity: e.target.value})} />
                  <Button onClick={handleBooking} className="mt-4">Book Now</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.map(booking => (
                <Card key={booking.id} className="mb-2">
                  <CardContent>
                    <p>Train: {trains.find(t => t.id === booking.trainId)?.name}</p>
                    <p>Seats: {booking.seatQuantity}</p>
                    <p>Cost: ${booking.cost}</p>
                    <Button onClick={() => cancelBooking(booking.id)}>Cancel</Button>
                  </CardContent>
                </Card>
              ))}
              {bookings.length === 0 && <p>No bookings yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-right">Balance: ${userBalance}</div>
    </div>
  );
}