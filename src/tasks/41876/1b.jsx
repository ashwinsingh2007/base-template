import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/";

const initialPatients = Array.from({length: 20}, (_, i) => ({
  id: i + 1,
  name: `Patient ${i + 1}`,
  age: Math.floor(Math.random() * 80) + 20,
  gender: Math.random() > 0.5 ? 'Male' : 'Female',
  address: `Address ${i + 1}`,
  contact: `+123456789${i}`,
  medicalHistory: 'No significant issues',
  emergencyContact: `Emergency ${i + 1}`,
  insurance: `Insurance ${i % 2 ? 'Yes' : 'No'}`,
  admissionDate: new Date().toISOString().split('T')[0],
}));

export default function App() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  const handleAddEditPatient = (patientData) => {
    if (patientData.id) {
      setPatients(patients.map(p => p.id === patientData.id ? patientData : p));
    } else {
      setPatients([...patients, { id: patients.length + 1, ...patientData }]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const filteredPatients = patients.filter(patient => 
    (patient.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterAge === '' || patient.age.toString() === filterAge) &&
    (filterGender === '' || patient.gender === filterGender)
  );

  const exportToCSV = () => {
    const headers = Object.keys(patients[0]).join(',');
    const rows = patients.map(p => Object.values(p).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patient_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Patient Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input 
            placeholder="Search by name" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full sm:w-1/2"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input 
              placeholder="Filter by Age" 
              value={filterAge} 
              onChange={(e) => setFilterAge(e.target.value)} 
              type="number" 
              className="flex-1"
            />
            <select 
              value={filterGender} 
              onChange={(e) => setFilterGender(e.target.value)} 
              className="flex-1 p-2 border rounded"
            >
              <option value="">Filter by Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <Button onClick={() => setOpenDialog(true)}>Add New Patient</Button>
          <Button onClick={exportToCSV}>Export to CSV</Button>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableColumn>Name</TableColumn>
            <TableColumn>Age</TableColumn>
            <TableColumn>Gender</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map(patient => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                <Button onClick={() => { setCurrentPatient(patient); setOpenDialog(true); }}>Edit</Button>
                <Button onClick={() => handleDelete(patient.id)} className="ml-2 bg-red-500 hover:bg-red-600">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPatient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddEditPatient(currentPatient || {}); }}>
            {/* Here you would add form fields for all patient details */}
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}