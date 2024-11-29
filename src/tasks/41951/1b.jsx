import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Generate dummy data
const generateDummyData = () => {
  const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan"];
  const models = ["Camry", "Civic", "F-150", "Malibu", "Altima"];
  const colors = ["Red", "Blue", "White", "Black", "Silver"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    licensePlate: `ABC${1000 + i}`,
    make: makes[Math.floor(Math.random() * makes.length)],
    model: models[Math.floor(Math.random() * models.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    dailyFuelQuota: Math.floor(Math.random() * 50) + 20,
    fuelConsumedToday: 0,
    dispensed: false,
    dispenseTime: null,
  }));
};

const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const [formData, setFormData] = useState(vehicle || {
    licensePlate: "",
    make: "",
    model: "",
    color: "",
    dailyFuelQuota: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="License Plate" required />
      <Input name="make" value={formData.make} onChange={handleChange} placeholder="Make" required />
      <Input name="model" value={formData.model} onChange={handleChange} placeholder="Model" required />
      <Input name="color" value={formData.color} onChange={handleChange} placeholder="Color" required />
      <Input name="dailyFuelQuota" type="number" value={formData.dailyFuelQuota} onChange={handleChange} placeholder="Daily Fuel Quota" required />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const FuelDispenseModal = ({ vehicle, onConfirm, onClose }) => {
  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispense Fuel for {vehicle?.licensePlate}</DialogTitle>
        </DialogHeader>
        <p>Daily Fuel Quota: {vehicle?.dailyFuelQuota} liters</p>
        <DialogFooter>
          <Button onClick={() => onConfirm(vehicle)}>Confirm Dispense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [vehicles, setVehicles] = useState(generateDummyData());
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [dispensingVehicle, setDispensingVehicle] = useState(null);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFuelDispensed, setTotalFuelDispensed] = useState(0);

  useEffect(() => {
    const total = vehicles.reduce((sum, vehicle) => sum + (vehicle.dispensed ? vehicle.dailyFuelQuota : 0), 0);
    setTotalFuelDispensed(total);
  }, [vehicles]);

  const filteredVehicles = vehicles.filter(v => v.licensePlate.toLowerCase().includes(filter.toLowerCase()));
  const pageSize = 5;
  const pageCount = Math.ceil(filteredVehicles.length / pageSize);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSaveVehicle = (vehicleData) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...vehicleData } : v));
    } else {
      setVehicles([...vehicles, { ...vehicleData, id: vehicles.length + 1, fuelConsumedToday: 0, dispensed: false }]);
    }
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleDispenseFuel = (vehicle) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicle.id) {
        return { ...v, dispensed: true, dispenseTime: new Date().toLocaleString() };
      }
      return v;
    }));
    setDispensingVehicle(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle Fuel Management</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Total Fuel Dispensed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalFuelDispensed} liters</p>
        </CardContent>
      </Card>

      <div className="mb-4">
        <Button onClick={() => setEditingVehicle({})}>Add New Vehicle</Button>
      </div>

      {editingVehicle && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{editingVehicle.id ? "Edit" : "Add"} Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm
              vehicle={editingVehicle}
              onSave={handleSaveVehicle}
              onCancel={() => setEditingVehicle(null)}
            />
          </CardContent>
        </Card>
      )}

      <div className="mb-4">
        <Input
          placeholder="Filter by License Plate"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fuel Dispensing Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Fuel Dispensed Today</TableHead>
                <TableHead>Daily Fuel Quota</TableHead>
                <TableHead>Dispense Status</TableHead>
                <TableHead>Date and Time of Dispense</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.dispensed ? vehicle.dailyFuelQuota : 0} liters</TableCell>
                  <TableCell>{vehicle.dailyFuelQuota} liters</TableCell>
                  <TableCell>{vehicle.dispensed ? "Dispensed" : "Not Dispensed"}</TableCell>
                  <TableCell>{vehicle.dispenseTime || "N/A"}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button size="sm" onClick={() => setEditingVehicle(vehicle)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</Button>
                      {!vehicle.dispensed && (
                        <Button size="sm" onClick={() => setDispensingVehicle(vehicle)}>Dispense Fuel</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {pageCount}</span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <FuelDispenseModal
        vehicle={dispensingVehicle}
        onConfirm={handleDispenseFuel}
        onClose={() => setDispensingVehicle(null)}
      />
    </div>
  );
}