import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Generate dummy data
const generateDummyData = () => {
  const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan"];
  const models = ["Camry", "Civic", "F-150", "Silverado", "Altima"];
  const colors = ["Red", "Blue", "White", "Black", "Silver"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    licensePlate: `ABC${(1000 + i).toString().padStart(4, "0")}`,
    make: makes[Math.floor(Math.random() * makes.length)],
    model: models[Math.floor(Math.random() * models.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    dailyFuelQuota: Math.floor(Math.random() * 50) + 20,
    fuelConsumedToday: 0,
    fuelDispensedToday: 0,
    dispenseStatus: "Not Dispensed",
    dispenseDateTime: null,
  }));
};

export default function App() {
  const [vehicles, setVehicles] = useState(generateDummyData());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    make: "",
    model: "",
    color: "",
    dailyFuelQuota: "",
  });
  const [isDispenseDialogOpen, setIsDispenseDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLicensePlate, setFilterLicensePlate] = useState("");
  const [filterDispenseStatus, setFilterDispenseStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const itemsPerPage = 5;

  // Filter and sort vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(filterLicensePlate.toLowerCase())
    )
    .filter((vehicle) =>
      filterDispenseStatus ? vehicle.dispenseStatus === filterDispenseStatus : true
    )
    .filter((vehicle) =>
      filterDate
        ? vehicle.dispenseDateTime &&
          new Date(vehicle.dispenseDateTime).toDateString() === new Date(filterDate).toDateString()
        : true
    )
    .sort((a, b) => {
      if (sortColumn === "dispenseDateTime") {
        return sortDirection === "asc"
          ? new Date(a.dispenseDateTime || 0) - new Date(b.dispenseDateTime || 0)
          : new Date(b.dispenseDateTime || 0) - new Date(a.dispenseDateTime || 0);
      } else if (sortColumn === "dailyFuelQuota") {
        return sortDirection === "asc"
          ? a.dailyFuelQuota - b.dailyFuelQuota
          : b.dailyFuelQuota - a.dailyFuelQuota;
      }
      return 0;
    });

  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage);
  const displayedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalFuelDispensed = vehicles.reduce((sum, vehicle) => sum + vehicle.fuelDispensedToday, 0);

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
    setIsAddDialogOpen(false);
    setNewVehicle({
      licensePlate: "",
      make: "",
      model: "",
      color: "",
      dailyFuelQuota: "",
    });
  };

  const handleDispenseFuel = () => {
    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicle.id
          ? {
              ...v,
              fuelDispensedToday: v.dailyFuelQuota,
              dispenseStatus: "Dispensed",
              dispenseDateTime: new Date().toISOString(),
            }
          : v
      )
    );
    setIsDispenseDialogOpen(false);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle Fuel Management</h1>

      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add Vehicle
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="Filter by License Plate"
          value={filterLicensePlate}
          onChange={(e) => setFilterLicensePlate(e.target.value)}
        />
        <Select value={filterDispenseStatus} onValueChange={setFilterDispenseStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Dispense Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Dispensed">Dispensed</SelectItem>
            <SelectItem value="Not Dispensed">Not Dispensed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>License Plate</TableHead>
            <TableHead>Fuel Dispensed Today</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dailyFuelQuota")}
            >
              Daily Fuel Quota {sortColumn === "dailyFuelQuota" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Dispense Status</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dispenseDateTime")}
            >
              Date and Time of Dispense {sortColumn === "dispenseDateTime" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.licensePlate}</TableCell>
              <TableCell>{vehicle.fuelDispensedToday}</TableCell>
              <TableCell>{vehicle.dailyFuelQuota}</TableCell>
              <TableCell>{vehicle.dispenseStatus}</TableCell>
              <TableCell>{vehicle.dispenseDateTime ? new Date(vehicle.dispenseDateTime).toLocaleString() : "-"}</TableCell>
              <TableCell>
                {vehicle.dispenseStatus === "Not Dispensed" && (
                  <Button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsDispenseDialogOpen(true);
                    }}
                  >
                    Dispense Fuel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Total Fuel Dispensed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalFuelDispensed} liters</p>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="License Plate"
            value={newVehicle.licensePlate}
            onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
          />
          <Input
            placeholder="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
          />
          <Input
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
          />
          <Input
            placeholder="Color"
            value={newVehicle.color}
            onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
          />
          <Input
            placeholder="Daily Fuel Quota"
            type="number"
            value={newVehicle.dailyFuelQuota}
            onChange={(e) => setNewVehicle({ ...newVehicle, dailyFuelQuota: e.target.value })}
          />
          <DialogFooter>
            <Button onClick={handleAddVehicle}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDispenseDialogOpen} onOpenChange={setIsDispenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispense Fuel</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <p>
              Fuel Quota for {selectedVehicle.licensePlate}: {selectedVehicle.dailyFuelQuota} liters
            </p>
          )}
          <DialogFooter>
            <Button onClick={handleDispenseFuel}>Confirm Dispense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}