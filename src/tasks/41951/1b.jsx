import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Input, Label
} from "@/components/ui/card";

// Utility function to generate dummy data
function generateDummyVehicles(count = 50) {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'];
  const models = ['Corolla', 'Civic', 'Mustang', 'Camaro', 'Altima'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    licensePlate: `ABC-${Math.floor(Math.random() * 9000) + 1000}`,
    make: makes[Math.floor(Math.random() * makes.length)],
    model: models[Math.floor(Math.random() * models.length)],
    color: ['red', 'blue', 'green', 'black', 'white'][Math.floor(Math.random() * 5)],
    dailyQuota: Math.floor(Math.random() * 100) + 20,
    fuelConsumed: Math.floor(Math.random() * 100),
    lastDispense: new Date().toISOString().split('T')[0],
    dispensedToday: false,
  }));
}

function VehicleForm({ onClose, onSubmit, vehicle = {} }) {
  const [formData, setFormData] = useState(vehicle);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vehicle.id ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">License Plate</Label>
              <Input id="licensePlate" value={formData.licensePlate} onChange={e => setFormData({...formData, licensePlate: e.target.value})} required />
            </div>
            {/* Add other fields similarly */}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DispenseModal({ vehicle, onDispense }) {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispense Fuel</DialogTitle>
        </DialogHeader>
        <p>Fuel Quota: {vehicle.dailyQuota} L</p>
        <DialogFooter>
          <Button onClick={() => onDispense(vehicle)}>Confirm Dispense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [vehicles, setVehicles] = useState(generateDummyVehicles());
  const [filter, setFilter] = useState({ plate: '', status: '', date: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'lastDispense', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [dispenseModal, setDispenseModal] = useState(null);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [filter]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter(vehicle => 
    vehicle.licensePlate.includes(filter.plate) &&
    (filter.status === '' || (filter.status === 'dispensed' ? vehicle.dispensedToday : !vehicle.dispensedToday)) &&
    (filter.date === '' || vehicle.lastDispense.includes(filter.date))
  );

  const addVehicle = (newVehicle) => {
    setVehicles(prev => [...prev, { ...newVehicle, id: prev.length + 1 }]);
  };

  const editVehicle = (editedVehicle) => {
    setVehicles(prev => prev.map(v => v.id === editedVehicle.id ? editedVehicle : v));
  };

  const deleteVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const dispenseFuel = (vehicle) => {
    setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, dispensedToday: true } : v));
    setDispenseModal(null);
  };

  const totalFuelDispensed = vehicles.reduce((acc, vehicle) => acc + (vehicle.dispensedToday ? vehicle.dailyQuota : 0), 0);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fuel Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input 
              placeholder="Filter by plate..."
              value={filter.plate}
              onChange={e => setFilter({...filter, plate: e.target.value})}
            />
            <Button onClick={() => setSelectedVehicle({})}>Add Vehicle</Button>
          </div>
          {/* Filter by status and date */}
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License</TableHead>
                <TableHead onClick={() => requestSort('lastDispense')}>Date</TableHead>
                <TableHead onClick={() => requestSort('dailyQuota')}>Quota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.slice((currentPage - 1) * 5, currentPage * 5).map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.lastDispense}</TableCell>
                  <TableCell>{vehicle.dailyQuota}</TableCell>
                  <TableCell>{vehicle.dispensedToday ? 'Dispensed' : 'Not Dispensed'}</TableCell>
                  <TableCell>
                    <Button onClick={() => setDispenseModal(vehicle)}>Dispense</Button>
                    <Button onClick={() => { setSelectedVehicle(vehicle); }}>Edit</Button>
                    <Button onClick={() => deleteVehicle(vehicle.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          {/* Total Fuel Dispensed Card */}
          <Card className="mt-4">
            <CardContent>
              <CardTitle>Total Fuel Dispensed Today</CardTitle>
              <p>{totalFuelDispensed} L</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {selectedVehicle !== null && (
        <VehicleForm 
          onClose={() => setSelectedVehicle(null)} 
          onSubmit={selectedVehicle.id ? editVehicle : addVehicle} 
          vehicle={selectedVehicle} 
        />
      )}

      {dispenseModal && <DispenseModal vehicle={dispenseModal} onDispense={dispenseFuel} />}
    </div>
  );
}

export default App;