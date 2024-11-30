// Import necessary React hooks and UI components
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Function to generate dummy vehicle data for the table
const generateDummyData = () => {
  const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan"]; // Sample vehicle makes
  const models = ["Camry", "Civic", "F-150", "Silverado", "Altima"]; // Sample vehicle models
  const colors = ["Red", "Blue", "White", "Black", "Silver"]; // Sample colors

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1, // Unique ID for each vehicle
    licensePlate: `ABC${(1000 + i).toString().padStart(4, "0")}`, // License plate number
    make: makes[Math.floor(Math.random() * makes.length)], // Random vehicle make
    model: models[Math.floor(Math.random() * models.length)], // Random vehicle model
    color: colors[Math.floor(Math.random() * colors.length)], // Random vehicle color
    dailyFuelQuota: Math.floor(Math.random() * 50) + 20, // Random daily fuel quota between 20 and 70
    fuelConsumedToday: 0, // Initial fuel consumed today
    fuelDispensedToday: 0, // Initial fuel dispensed today
    dispenseStatus: "Not Dispensed", // Initial dispense status
    dispenseDateTime: null, // No dispense date initially
  }));
};

// Main application component
export default function App() {
  const [vehicles, setVehicles] = useState(generateDummyData()); // State to hold the list of vehicles
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // State to manage Add Vehicle dialog visibility
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    make: "",
    model: "",
    color: "",
    dailyFuelQuota: "",
    fuelConsumedToday: 0,
    fuelDispensedToday: 0,
    dispenseStatus: "Not Dispensed",
    dispenseDateTime: null,
  }); // State for new vehicle details
  const [isDispenseDialogOpen, setIsDispenseDialogOpen] = useState(false); // State for Dispense Fuel dialog visibility
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State to hold the selected vehicle for dispensing
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filterLicensePlate, setFilterLicensePlate] = useState(""); // Filter by license plate
  const [filterDispenseStatus, setFilterDispenseStatus] = useState("all"); // Filter by dispense status
  const [filterDate, setFilterDate] = useState(""); // Filter by dispense date
  const [sortColumn, setSortColumn] = useState(null); // Column for sorting
  const [sortDirection, setSortDirection] = useState("asc"); // Sorting direction

  const itemsPerPage = 5; // Number of items per page

  // Filter, sort, and paginate vehicles
  const filteredVehicles = vehicles
    .filter((vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(filterLicensePlate.toLowerCase()) // Filter by license plate
    )
    .filter((vehicle) =>
      filterDispenseStatus && filterDispenseStatus !== "all"  ? vehicle.dispenseStatus === filterDispenseStatus : true // Filter by status
    )
    .filter((vehicle) =>
      filterDate
        ? vehicle.dispenseDateTime &&
          new Date(vehicle.dispenseDateTime).toDateString() === new Date(filterDate).toDateString() // Filter by date
        : true
    )
    .sort((a, b) => {
      if (sortColumn === "dispenseDateTime") {
        return sortDirection === "asc"
          ? new Date(a.dispenseDateTime || 0) - new Date(b.dispenseDateTime || 0) // Sort by dispense date
          : new Date(b.dispenseDateTime || 0) - new Date(a.dispenseDateTime || 0);
      } else if (sortColumn === "dailyFuelQuota") {
        return sortDirection === "asc"
          ? a.dailyFuelQuota - b.dailyFuelQuota // Sort by daily fuel quota
          : b.dailyFuelQuota - a.dailyFuelQuota;
      }
      return 0;
    });

  const pageCount = Math.ceil(filteredVehicles.length / itemsPerPage); // Total number of pages
  const displayedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // Vehicles to display on the current page

  const totalFuelDispensed = vehicles.reduce((sum, vehicle) => sum + vehicle.fuelDispensedToday, 0); // Total fuel dispensed today

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]); // Add new vehicle to the list
    setIsAddDialogOpen(false); // Close Add Vehicle dialog
    setNewVehicle({
      licensePlate: "",
      make: "",
      model: "",
      color: "",
      dailyFuelQuota: "",
    }); // Reset new vehicle fields
  };

  const handleDispenseFuel = () => {
    setVehicles(
      vehicles.map((v) =>
        v.id === selectedVehicle.id
          ? {
              ...v,
              fuelDispensedToday: v.dailyFuelQuota, // Set fuel dispensed to daily quota
              dispenseStatus: "Dispensed", // Update status
              dispenseDateTime: new Date().toISOString(), // Update date and time
            }
          : v
      )
    );
    setIsDispenseDialogOpen(false); // Close Dispense Fuel dialog
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc"); // Toggle sorting direction
    } else {
      setSortColumn(column); // Set sorting column
      setSortDirection("asc"); // Default sorting direction to ascending
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-4">Vehicle Fuel Management</h1>

      {/* Total Fuel Dispensed Card */}
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Total Fuel Dispensed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalFuelDispensed} liters</p>
        </CardContent>
      </Card>

      {/* Add Vehicle Button */}
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        Add Vehicle
      </Button>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="Filter by License Plate"
          value={filterLicensePlate}
          onChange={(e) => setFilterLicensePlate(e.target.value)} // Update license plate filter
        />
        <Select value={filterDispenseStatus} onValueChange={setFilterDispenseStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Dispense Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Dispensed">Dispensed</SelectItem>
            <SelectItem value="Not Dispensed">Not Dispensed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)} // Update date filter
        />
      </div>

      {/* Vehicles Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>License Plate</TableHead>
            <TableHead>Fuel Dispensed Today</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dailyFuelQuota")}
            >
              Daily Fuel Quota {sortColumn === "dailyFuelQuota" && (sortDirection === "asc" ? "↑" : "↓")} {/* Sort icon */}
            </TableHead>
            <TableHead>Dispense Status</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dispenseDateTime")}
            >
              Date and Time of Dispense {sortColumn === "dispenseDateTime" && (sortDirection === "asc" ? "↑" : "↓")} {/* Sort icon */}
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
                      setSelectedVehicle(vehicle); // Set selected vehicle
                      setIsDispenseDialogOpen(true); // Open Dispense Fuel dialog
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1} // Disable Previous button on first page
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount} // Disable Next button on last page
        >
          Next
        </Button>
      </div>

      {/* Add Vehicle Dialog */}
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

      {/* Dispense Fuel Dialog */}
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
