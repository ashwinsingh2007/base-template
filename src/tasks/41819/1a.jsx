import React, { useState, useEffect } from 'react';
import { Input, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

const JobCard = ({ job, onApply, onSave }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{job.title}</CardTitle>
      <CardDescription>{job.company}, {job.location}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{job.description.substring(0, 100)}...</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button onClick={() => onApply(job)}>Apply</Button>
      <Button onClick={() => onSave(job)} variant="outline">Save</Button>
    </CardFooter>
  </Card>
);

const ApplicationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', coverLetter: '', experience: '', skills: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <Input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="mb-2"/>
          <Input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="mb-2"/>
          <textarea className="w-full p-2 mb-2 border rounded" placeholder="Cover Letter" value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})}></textarea>
          <Input type="text" placeholder="Experience" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="mb-2"/>
          <Input type="text" placeholder="Skills" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="mb-2"/>
          <Button type="submit">Submit Application</Button>
          <Button type="button" onClick={onClose} variant="secondary" className="ml-2">Cancel</Button>
        </form>
      </div>
    </div>
  );
};

const dummyJobs = Array.from({length: 20}, (_, i) => ({
  id: i + 1,
  title: `Job Title ${i + 1}`,
  company: `Company ${String.fromCharCode(65 + i)}`,
  location: `City ${i % 5}`,
  industry: `Industry ${i % 3}`,
  description: `This is a job for ${i + 1}. Here are many details about this job...`,
  responsibilities: 'Manage, develop, support...',
  deadline: '2023-12-31',
}));

export default function App() {
  const [jobs, setJobs] = useState(dummyJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    const filteredJobs = dummyJobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setJobs(filteredJobs);
  }, [searchTerm]);

  const handleApply = (job) => {
    setCurrentJob(job);
    setShowForm(true);
  };

  const handleSave = (job) => {
    if (!savedJobs.some(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const submitApplication = (formData) => {
    setApplications([...applications, { job: currentJob, ...formData, status: 'Applied' }]);
  };

  return (
    <div className="container mx-auto p-4">
      <Input 
        placeholder="Search for jobs..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} onSave={handleSave} />
          ))}
        </TabsContent>
        <TabsContent value="saved">
          {savedJobs.map(job => <JobCard key={job.id} job={job} />)}
        </TabsContent>
        <TabsContent value="applications">
          {applications.map((app, index) => (
            <div key={index} className="mb-2">
              <h3>{app.job.title}</h3>
              <p>Status: {app.status}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
      {showForm && <ApplicationForm onClose={() => setShowForm(false)} onSubmit={submitApplication} />}
    </div>
  );
}