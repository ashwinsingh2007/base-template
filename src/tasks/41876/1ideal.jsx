import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Generate dummy data for initial patient list
const dummyData = [];
for (let i = 1; i <= 5; i++) {
  dummyData.push({
    id: i,
    name: `Patient ${i}`,
    age: Math.floor(Math.random() * 60) + 20, // Random age between 20 and 80
    gender: i % 2 === 0 ? "Male" : "Female",
    address: `${i * 10} Example St`,
    contact: `123-456-${(7000 + i).toString().padStart(4, "0")}`,
    medicalHistory: `Allergies: ${i % 3 === 0 ? "Peanuts" : "None"}`,
    emergencyContact: `Emergency Contact ${i}: 987-654-${(3200 + i).toString().padStart(4, "0")}`,
    insurance: `Insurance ${i % 5 === 0 ? "Gold Plan" : "Standard Plan"}`,
    admissionDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(
      Math.floor(Math.random() * 28) + 1
    ).padStart(2, "0")}`, // Random date in 2023
  });
}

export default function App() {
  // State for patient data and filters
  const [patients, setPatients] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState(""); // Search by patient name
  const [ageFilter, setAgeFilter] = useState(""); // Filter by age
  const [genderFilter, setGenderFilter] = useState(""); // Filter by gender
  const [editingPatient, setEditingPatient] = useState(null); // Currently edited patient
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // Control add dialog visibility

  // Filtered patients based on search term and filters
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (ageFilter === "" || patient.age === parseInt(ageFilter, 10)) &&
      (genderFilter === "" || patient.gender === genderFilter)
  );

  // Function to add a new patient
  const addPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1, age: parseInt(newPatient.age, 10) }]);
    setIsAddDialogOpen(false); // Close modal after adding
  };

  // Function to update an existing patient
  const updatePatient = (updatedPatient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? { ...updatedPatient, age: parseInt(updatedPatient.age, 10) } : p))
    );
    setEditingPatient(null); // Close modal after editing
  };

  // Function to delete a patient record
  const deletePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  // Export patient data to CSV
  const exportToCSV = () => {
    const headers = Object.keys(patients[0]).join(",");
    const csv = [
      headers,
      ...patients.map((p) => Object.values(p).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "patients.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Import patient data from a CSV file
  const importFromCSV = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      const headers = lines[0].split(",");
      const newPatients = lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
      setPatients([...patients, ...newPatients]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Patient Management</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        {/* Input field for searching patients by name */}
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
        {/* Select for filtering by age */}
        <Select onValueChange={setAgeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Age" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(patients.map((p) => p.age))].map((age) => (
              <SelectItem key={age} value={age.toString()}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Select for filtering by gender */}
        <Select onValueChange={setGenderFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {/* Add patient dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm onSubmit={addPatient} />
          </DialogContent>
        </Dialog>
        {/* Export to CSV button */}
        <Button onClick={exportToCSV}>Export to CSV</Button>
        {/* Input for importing CSV */}
        <Input type="file" accept=".csv" onChange={importFromCSV} />
      </div>
      {/* Table displaying patient records */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                {/* Edit patient dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setEditingPatient(patient)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Patient</DialogTitle>
                    </DialogHeader>
                    <PatientForm patient={editingPatient} onSubmit={updatePatient} />
                  </DialogContent>
                </Dialog>
                {/* Delete patient button */}
                <Button variant="destructive" onClick={() => deletePatient(patient.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Component for the patient form (used for both adding and editing)
function PatientForm({ patient, onSubmit }) {
  const [formData, setFormData] = useState(
    patient || {
      name: "",
      age: "",
      gender: "",
      address: "",
      contact: "",
      medicalHistory: "",
      emergencyContact: "",
      insurance: "",
      admissionDate: "",
    }
  );

  useEffect(() => {
    setFormData(patient || {
      name: "",
      age: "",
      gender: "",
      address: "",
      contact: "",
      medicalHistory: "",
      emergencyContact: "",
      insurance: "",
      admissionDate: "",
    });
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields for patient details */}
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Patient Name" required />
      <Input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" required />
      <Select
        name="gender"
        value={formData.gender}
        onValueChange={(value) => setFormData({ ...formData, gender: value })}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
        </SelectContent>
      </Select>
      <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact Information" />
      <Input name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} placeholder="Medical History" />
      <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" />
      <Input name="insurance" value={formData.insurance} onChange={handleChange} placeholder="Insurance Details" />
      <Input name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} placeholder="Date of Admission" />
      <Button type="submit">Save</Button>
    </form>
  );
}
