import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample data
const sampleProjects = [
  { id: 1, name: "Website Redesign", description: "Revamp company website", startDate: "2023-07-01", endDate: "2023-09-30", priority: "High", category: "Work", dueDate: "2023-09-30", status: "In Progress" },
  { id: 2, name: "Learn React", description: "Master React fundamentals", startDate: "2023-08-01", endDate: "2023-10-31", priority: "Medium", category: "Learning", dueDate: "2023-10-31", status: "In Progress" },
  { id: 3, name: "Fitness Goal", description: "Lose 10 pounds", startDate: "2023-07-15", endDate: "2023-12-31", priority: "Low", category: "Personal", dueDate: "2023-12-31", status: "In Progress" },
  { id: 4, name: "Mobile App Development", description: "Create a new mobile app", startDate: "2023-09-01", endDate: "2024-02-29", priority: "High", category: "Work", dueDate: "2024-02-29", status: "Not Started" },
  { id: 5, name: "Home Renovation", description: "Renovate kitchen and bathroom", startDate: "2023-10-01", endDate: "2023-12-15", priority: "Medium", category: "Personal", dueDate: "2023-12-15", status: "Not Started" },
  { id: 6, name: "Data Analysis Course", description: "Complete online data analysis course", startDate: "2023-08-15", endDate: "2023-11-30", priority: "Low", category: "Learning", dueDate: "2023-11-30", status: "In Progress" },
  { id: 7, name: "Client Presentation", description: "Prepare and deliver client presentation", startDate: "2023-09-15", endDate: "2023-09-30", priority: "High", category: "Work", dueDate: "2023-09-30", status: "Completed" },
  { id: 8, name: "Family Vacation Planning", description: "Plan summer family vacation", startDate: "2023-11-01", endDate: "2024-06-30", priority: "Medium", category: "Personal", dueDate: "2024-06-30", status: "Not Started" },
  { id: 9, name: "Networking Event", description: "Attend industry networking event", startDate: "2023-10-15", endDate: "2023-10-15", priority: "Low", category: "Work", dueDate: "2023-10-15", status: "Completed" },
  { id: 10, name: "Blog Writing", description: "Write and publish weekly blog posts", startDate: "2023-07-01", endDate: "2023-12-31", priority: "Medium", category: "Personal", dueDate: "2023-12-31", status: "In Progress" },
];

export default function App() {
  const [projects, setProjects] = useState(sampleProjects);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    let result = projects;
    
    // Apply filters
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      result = result.filter(project => project.status === statusFilter);
    }
    if (priorityFilter !== "All") {
      result = result.filter(project => project.priority === priorityFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, priorityFilter, sortBy]);

  const addProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const upcomingProjects = projects.filter(p => p.status !== "Completed").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Project Management Dashboard</h1>
      
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcomingProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedProjects}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Project Button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full sm:w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
          className="w-full sm:w-auto"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          className="w-full sm:w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={addProject} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.startDate}</TableCell>
              <TableCell>{project.endDate}</TableCell>
              <TableCell>{project.priority}</TableCell>
              <TableCell>{project.category}</TableCell>
              <TableCell>{project.dueDate}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingProject(project)} className="mr-2">Edit</Button>
                <Button onClick={() => deleteProject(project.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectForm project={editingProject} onSubmit={updateProject} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ProjectForm({ project, onSubmit }) {
  const [formData, setFormData] = useState(
    project || {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "Medium",
      category: "Work",
      dueDate: "",
      status: "Not Started"
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
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" required />
      <Input name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
      <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
      <Select name="priority" value={formData.priority} onValueChange={(value) => handleChange({ target: { name: "priority", value } })}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </Select>
      <Select name="category" value={formData.category} onValueChange={(value) => handleChange({ target: { name: "category", value } })}>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Learning">Learning</option>
      </Select>
      <Input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
      <Select name="status" value={formData.status} onValueChange={(value) => handleChange({ target: { name: "status", value } })}>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Select>
      <Button type="submit">{project ? "Update Project" : "Add Project"}</Button>
    </form>
  );
}