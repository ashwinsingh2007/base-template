import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Table, TableHeader, TableBody, TableRow, TableCell, Pagination,
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter 
} from "@/components/ui";

const generateDummyVehicles = (count) => {
  const vehicles = [];
  for (let i = 0; i < count; i++) {
    vehicles.push({
      id: i,
      licensePlate: `ABC-${Math.floor(Math.random() * 9000) + 1000}`,
      makeModel: `Car ${Math.floor(Math.random() * 100)}`,
      color: ['Red', 'Blue', 'Green', 'Yellow', 'Black'][Math.floor(Math.random() * 5)],
      dailyQuota: Math.floor(Math.random() * 100) + 50,
      fuelConsumed: Math.floor(Math.random() * 50),
      lastDispense: new Date().toISOString(),
      isDispensedToday: Math.random() > 0.5,
    });
  }
  return vehicles;
};

function VehicleForm({ onSubmit, onCancel, vehicle = {} }) {
  const [formData, setFormData] = useState(vehicle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: vehicle.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        value={formData.licensePlate || ''} 
        onChange={(e) => setFormData({...formData, licensePlate: e.target.value})} 
        placeholder="License Plate" 
        required 
      />
      <Input 
        value={formData.makeModel || ''} 
        onChange={(e) => setFormData({...formData, makeModel: e.target.value})} 
        placeholder="Make and Model" 
        required 
      />
      <Input 
        value={formData.color || ''} 
        onChange={(e) => setFormData({...formData, color: e.target.value})} 
        placeholder="Color" 
        required 
      />
      <Input 
        type="number" 
        value={formData.dailyQuota || ''} 
        onChange={(e) => setFormData({...formData, dailyQuota: Number(e.target.value)})} 
        placeholder="Daily Fuel Quota" 
        required 
      />
      <div className="flex space-x-4">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function FuelDispenseModal({ isOpen, onClose, onDispense, vehicle }) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Dispense Fuel</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>Dispense fuel for {vehicle.licensePlate}?</p>
          <p>Daily Quota: {vehicle.dailyQuota} liters</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { onDispense(vehicle); onClose(); }}>Confirm Dispense</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function App() {
  const [vehicles, setVehicles] = useState(generateDummyVehicles(50));
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);

  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = vehicles.filter(v => v.licensePlate.includes(filter)).slice(firstIndex, lastIndex);
  const npage = Math.ceil(vehicles.length / recordsPerPage);
  const totalFuelDispensed = vehicles.reduce((acc, vehicle) => acc + (vehicle.isDispensedToday ? vehicle.dailyQuota : 0), 0);

  const handleDelete = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleDispense = (vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? {...v, isDispensedToday: true, fuelConsumed: v.dailyQuota, lastDispense: new Date().toISOString()} : v));
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle);
  };

  const handleSaveVehicle = (vehicleData) => {
    if (editVehicle) {
      setVehicles(vehicles.map(v => v.id === vehicleData.id ? vehicleData : v));
    } else {
      setVehicles([...vehicles, vehicleData]);
    }
    setEditVehicle(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Vehicle Fuel Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setEditVehicle({})}>Add Vehicle</Button>
          {editVehicle && <VehicleForm onSubmit={handleSaveVehicle} onCancel={() => setEditVehicle(null)} vehicle={editVehicle} />}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <Input 
            placeholder="Filter by License Plate" 
            value={filter} 
            onChange={(e) => {setFilter(e.target.value); setCurrentPage(1);}} 
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>License Plate</TableCell>
                <TableCell>Fuel Dispensed</TableCell>
                <TableCell>Daily Quota</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Dispense</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(vehicle => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.fuelConsumed} L</TableCell>
                  <TableCell>{vehicle.dailyQuota} L</TableCell>
                  <TableCell>{vehicle.isDispensedToday ? 'Dispensed' : 'Pending'}</TableCell>
                  <TableCell>{new Date(vehicle.lastDispense).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => {setSelectedVehicle(vehicle); setModalOpen(true);}} disabled={vehicle.isDispensedToday}>
                      Dispense
                    </Button>
                    <Button onClick={() => handleEdit(vehicle)}>Edit</Button>
                    <Button onClick={() => handleDelete(vehicle.id)} variant="destructive">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination 
            total={npage} 
            current={currentPage} 
            onChange={setCurrentPage} 
            className="mt-4"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Fuel Dispensed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{totalFuelDispensed} liters</p>
        </CardContent>
      </Card>

      <FuelDispenseModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onDispense={handleDispense}
        vehicle={selectedVehicle}
      />
    </div>
  );
}