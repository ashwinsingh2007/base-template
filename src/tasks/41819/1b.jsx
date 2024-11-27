import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const dummyJobs = [
  {
    id: 1,
    title: "Software Engineer",
    location: "San Francisco, CA",
    industry: "Technology",
    description: "We are seeking a talented Software Engineer to join our team...",
    responsibilities: "Develop and maintain web applications...",
    deadline: "2023-08-31",
    company: "TechCorp Inc.",
  },
  // ... Add 19 more dummy job objects here
];

function JobCard({ job, onSave, onApply }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.company} - {job.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{job.description.substring(0, 100)}...</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onSave(job)}>Save</Button>
        <Button onClick={() => onApply(job)}>Apply</Button>
      </CardFooter>
    </Card>
  );
}

function JobDetails({ job, onClose, onApply }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="mb-2">{job.company} - {job.location}</p>
      <p className="mb-2"><strong>Industry:</strong> {job.industry}</p>
      <p className="mb-2"><strong>Description:</strong> {job.description}</p>
      <p className="mb-2"><strong>Responsibilities:</strong> {job.responsibilities}</p>
      <p className="mb-2"><strong>Application Deadline:</strong> {job.deadline}</p>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={() => onApply(job)}>Apply</Button>
      </div>
    </div>
  );
}

function ApplicationForm({ job, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(job, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="experience">Previous Experience</Label>
        <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} required />
      </div>
      <Button type="submit">Submit Application</Button>
    </form>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isApplying, setIsApplying] = useState(false);

  const filteredJobs = dummyJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveJob = (job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const handleApplyJob = (job) => {
    setSelectedJob(job);
    setIsApplying(true);
  };

  const handleSubmitApplication = (job, formData) => {
    setAppliedJobs([...appliedJobs, { ...job, status: "Applied", ...formData }]);
    setIsApplying(false);
    setSelectedJob(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Portal</h1>
      <Tabs defaultValue="search">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Search Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onSave={handleSaveJob} onApply={handleApplyJob} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map(job => (
              <JobCard key={job.id} job={job} onSave={handleSaveJob} onApply={handleApplyJob} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="applied">
          <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
          <div className="space-y-4">
            {appliedJobs.map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company} - {job.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><strong>Status:</strong> {job.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={selectedJob !== null} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && !isApplying && (
            <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApplyJob} />
          )}
          {isApplying && (
            <ApplicationForm job={selectedJob} onSubmit={handleSubmitApplication} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}