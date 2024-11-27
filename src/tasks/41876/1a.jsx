import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const dummyData = [
  { id: 1, name: "John Doe", age: 35, gender: "Male", address: "123 Main St", contact: "123-456-7890", medicalHistory: "Allergies: Peanuts", emergencyContact: "Jane Doe: 987-654-3210", insurance: "Blue Cross", admissionDate: "2023-01-15" },
  // ... Add 19 more dummy records here
];

export default function App() {
  const [patients, setPatients] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (ageFilter === "" || patient.age === parseInt(ageFilter)) &&
      (genderFilter === "" || patient.gender === genderFilter)
  );

  const addPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
  };

  const updatePatient = (updatedPatient) => {
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };

  const deletePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

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
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm onSubmit={addPatient} />
          </DialogContent>
        </Dialog>
        <Button onClick={exportToCSV}>Export to CSV</Button>
        <Input type="file" accept=".csv" onChange={importFromCSV} />
      </div>
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
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Patient Name" required />
      <Input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" required />
      <Select name="gender" onValueChange={(value) => setFormData({ ...formData, gender: value })} required>
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