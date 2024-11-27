import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

const priorities = ['Low', 'Medium', 'High'];
const categories = ['Work', 'Personal', 'Learning'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Launch Website', description: 'Deploy the new company site', startDate: '2023-01-01', endDate: '2023-03-01', priority: 'High', category: 'Work', dueDate: '2023-02-15', status: 'In Progress' },
    // ... 9 more sample projects
  ]);
  const [filter, setFilter] = useState({ name: '', status: '', priority: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', startDate: '', endDate: '', priority: 'Medium', category: 'Work', status: 'Not Started' });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    // Here you would typically fetch projects from an API
  }, []);

  const addProject = () => {
    setProjects([...projects, { ...newProject, id: Date.now() }]);
    setNewProject({ name: '', description: '', startDate: '', endDate: '', priority: 'Medium', category: 'Work', status: 'Not Started' });
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(filter.name.toLowerCase()) &&
    (filter.status === '' || project.status === filter.status) &&
    (filter.priority === '' || project.priority === filter.priority)
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Management Dashboard</h1>
        <div>
          <span className="mr-4">Upcoming: {projects.filter(p => p.status !== 'Completed').length}</span>
          <span>Completed: {projects.filter(p => p.status === 'Completed').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="Project Name" className="mb-2" />
            <Input value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="Description" className="mb-2" />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input type="date" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} placeholder="Start Date" />
              <Input type="date" value={newProject.endDate} onChange={e => setNewProject({...newProject, endDate: e.target.value})} placeholder="End Date" />
            </div>
            <Select value={newProject.priority} onValueChange={value => setNewProject({...newProject, priority: value})}>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </Select>
          </CardContent>
          <CardFooter>
            <Button onClick={addProject}>Add Project</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={filter.name} onChange={e => setFilter({...filter, name: e.target.value})} placeholder="Search by name" className="mb-2" />
            <Select value={filter.status} onValueChange={value => setFilter({...filter, status: value})} placeholder="Filter by status">
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </Select>
            <Select value={filter.priority} onValueChange={value => setFilter({...filter, priority: value})} placeholder="Filter by priority">
              <SelectItem value="">All Priorities</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl mb-4">Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th>Start</th>
                <th>End</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project.id}>
                  {editingProject === project.id ? (
                    <EditProjectForm project={project} onSave={updateProject} onCancel={() => setEditingProject(null)} />
                  ) : (
                    <ProjectRow project={project} onEdit={() => setEditingProject(project.id)} onDelete={deleteProject} />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EditProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState(project);

  return (
    <>
      <td><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></td>
      <td><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></td>
      <td><Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></td>
      <td><Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></td>
      <td>
        <Select value={formData.priority} onValueChange={value => setFormData({...formData, priority: value})}>
          {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </Select>
      </td>
      <td>
        <Select value={formData.category} onValueChange={value => setFormData({...formData, category: value})}>
          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </Select>
      </td>
      <td><Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></td>
      <td>
        <Select value={formData.status} onValueChange={value => setFormData({...formData, status: value})}>
          {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
      </td>
      <td>
        <Button onClick={() => onSave(formData)}>Save</Button>
        <Button onClick={onCancel} className="ml-2">Cancel</Button>
      </td>
    </>
  );
}

function ProjectRow({ project, onEdit, onDelete }) {
  return (
    <>
      <td>{project.name}</td>
      <td>{project.description}</td>
      <td>{project.startDate}</td>
      <td>{project.endDate}</td>
      <td>{project.priority}</td>
      <td>{project.category}</td>
      <td>{project.dueDate}</td>
      <td>{project.status}</td>
      <td>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={() => onDelete(project.id)} className="ml-2">Delete</Button>
      </td>
    </>
  );
}

export default App;