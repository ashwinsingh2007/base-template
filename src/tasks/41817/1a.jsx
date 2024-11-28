import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui";

const exercises = [
  { name: "Jogging", time: 30, calorieBurn: 250, steps: "Run at a steady pace." },
  { name: "Yoga", time: 60, calorieBurn: 180, steps: "Perform sun salutations." },
  // Add 18 more exercises here...
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {
  const [filterName, setFilterName] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterCalorie, setFilterCalorie] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ type: '', data: null });

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterTime === '' || ex.time === parseInt(filterTime)) &&
      (filterCalorie === '' || ex.calorieBurn === parseInt(filterCalorie))
    );
  }, [filterName, filterTime, filterCalorie]);

  const addExercise = (exercise, day) => {
    if (selectedExercises.some(ex => ex.name === exercise.name && ex.day === day)) {
      alert("Exercise already added for this day!");
      return;
    }
    setSelectedExercises(prev => [...prev, { ...exercise, day }]);
    setIsModalOpen(false);
  };

  const removeExercise = (index) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
    setIsModalOpen(false);
  };

  const openModal = (type, data = null) => {
    setCurrentAction({ type, data });
    setIsModalOpen(true);
  };

  const totalTime = selectedExercises.reduce((total, ex) => total + ex.time, 0);
  const totalCalories = selectedExercises.reduce((total, ex) => total + ex.calorieBurn, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fitness Routine Tracker</h1>
      
      <Tabs />

      {/* Exercise List */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Available Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input placeholder="Search by name" value={filterName} onChange={e => setFilterName(e.target.value)} />
            <Input type="number" placeholder="Time" value={filterTime} onChange={e => setFilterTime(e.target.value)} />
            <Input type="number" placeholder="Calorie Burn" value={filterCalorie} onChange={e => setFilterCalorie(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Calorie Burn</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((ex, idx) => (
                <TableRow key={idx}>
                  <TableCell>{ex.name}</TableCell>
                  <TableCell>{ex.time} min</TableCell>
                  <TableCell>{ex.calorieBurn} cal</TableCell>
                  <TableCell>
                    <Button onClick={() => openModal('add', ex)}>Add</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* My Exercises */}
      <Card>
        <CardHeader>
          <CardTitle>My Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Calorie Burn</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedExercises.map((ex, idx) => (
                <TableRow key={idx}>
                  <TableCell>{ex.name}</TableCell>
                  <TableCell>{ex.time} min</TableCell>
                  <TableCell>{ex.calorieBurn} cal</TableCell>
                  <TableCell>{ex.day}</TableCell>
                  <TableCell>
                    <Button onClick={() => openModal('remove', idx)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <p>Total Time: {totalTime} min</p>
            <p>Total Calories Burned: {totalCalories} cal</p>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{currentAction.type === 'add' ? 'Add Exercise' : 'Remove Exercise'}</ModalHeader>
          <ModalBody>
            {currentAction.type === 'add' && (
              <Select onValueChange={day => addExercise(currentAction.data, day)}>
                {daysOfWeek.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </Select>
            )}
            {currentAction.type === 'remove' && 'Are you sure you want to remove this exercise?'}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => {
              if (currentAction.type === 'add') {
                // Here we assume the last selected day is what we want, for simplicity
                addExercise(currentAction.data, daysOfWeek[0]);
              } else {
                removeExercise(currentAction.data);
              }
            }}>Confirm</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function Tabs() {
  return (
    <div className="mb-4">
      {/* Implement tab switching logic if needed */}
      <Button variant="outline">Exercises</Button>
      <Button variant="outline" className="ml-2">My Exercises</Button>
    </div>
  );
}

export default App;