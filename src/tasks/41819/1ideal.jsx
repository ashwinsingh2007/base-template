// Import necessary dependencies and components
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Generate dummy job data to populate the job portal
const dummyJobs = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1, // Assign a unique ID starting from 1
  title: `Job Title ${index + 1}`, // Generate a generic job title
  location: `City ${index + 1}, State ${index % 2 === 0 ? "CA" : "NY"}`, // Alternate locations between CA and NY
  industry: index % 3 === 0 ? "Technology" : index % 3 === 1 ? "Healthcare" : "Finance", // Cycle through industries
  description: `This is a description for Job Title ${index + 1}. It provides an overview of the role and responsibilities.`,
  responsibilities: `Responsibilities for Job Title ${index + 1} include managing tasks and collaborating with the team.`,
  deadline: `2024-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`, // Generate a deadline date
  company: `Company ${index + 1}`, // Assign a company name
}));

console.log(dummyJobs); // Log generated data for verification

// Application form component to submit job applications
function ApplicationForm({ job, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    experience: "",
    skills: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(job, formData); // Pass form data to parent component
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields for applicant details */}
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

// JobCard component to display job details and provide actions
function JobCard({ job, onSave, onApply, onViewDetails, isSaved, isApplied }) {
  return (
    <Card className="mb-4">
      {/* Display job title and description */}
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>
          {job.company} - {job.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{job.description.substring(0, 100)}...</p>
      </CardContent>
      {/* Action buttons for saving, viewing details, or applying */}
      <CardFooter className="flex justify-between">
        {!isSaved && <Button variant="outline" onClick={() => onSave(job)}>Save</Button>}
        <Button onClick={() => onViewDetails(job)}>View Details</Button>
        <Button onClick={() => onApply(job)} disabled={isApplied}>
          {isApplied ? "Applied" : "Apply"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main App component
export default function App() {
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering jobs
  const [selectedJob, setSelectedJob] = useState(null); // Job selected for viewing or applying
  const [isApplying, setIsApplying] = useState(false); // State for application dialog
  const [savedJobs, setSavedJobs] = useState([]); // List of saved jobs
  const [appliedJobs, setAppliedJobs] = useState([]); // List of applied jobs

  // Filter jobs based on search term
  const filteredJobs = dummyJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a job to the saved jobs list
  const handleSaveJob = (job) => {
    if (!savedJobs.find((j) => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  // Handle job application process
  const handleApplyJob = (job) => {
    if (!appliedJobs.find((j) => j.id === job.id)) {
      setSelectedJob(job);
      setIsApplying(true); // Open application dialog
    }
  };

  // Handle submission of job application
  const handleSubmitApplication = (job, formData) => {
    setAppliedJobs([...appliedJobs, { ...job, ...formData }]); // Add job to applied list
    setIsApplying(false); // Close dialog
    setSelectedJob(null);
  };

  // View job details without applying
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsApplying(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-4">Job Portal</h1>

      {/* Tab navigation for search, saved, and applied jobs */}
      <Tabs defaultValue="search">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Search Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
        </TabsList>

        {/* Search jobs tab */}
        <TabsContent value="search">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                onViewDetails={handleViewDetails}
                isSaved={false}
                isApplied={appliedJobs.some((j) => j.id === job.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Saved jobs tab */}
        <TabsContent value="saved">
          <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
                onViewDetails={handleViewDetails}
                isSaved={true}
                isApplied={appliedJobs.some((j) => j.id === job.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Applied jobs tab */}
        <TabsContent value="applied">
          <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
          <div className="space-y-4">
            {appliedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} - {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Status:</strong> Applied
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for job details or application form */}
      <Dialog
        open={selectedJob !== null}
        onOpenChange={() => setSelectedJob(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApplying ? "Apply for Job" : "Job Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedJob && isApplying ? (
            <ApplicationForm
              job={selectedJob}
              onSubmit={handleSubmitApplication}
            />
          ) : (
            selectedJob && (
              <div className="p-4">
                {/* Job details display */}
                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                <p className="mb-2">
                  {selectedJob.company} - {selectedJob.location}
                </p>
                <p className="mb-2">
                  <strong>Industry:</strong> {selectedJob.industry}
                </p>
                <p className="mb-2">
                  <strong>Description:</strong> {selectedJob.description}
                </p>
                <p className="mb-2">
                  <strong>Responsibilities:</strong>{" "}
                  {selectedJob.responsibilities}
                </p>
                <p className="mb-2">
                  <strong>Application Deadline:</strong>{" "}
                  {selectedJob.deadline}
                </p>
                {/* Action buttons */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleApplyJob(selectedJob)}
                    disabled={appliedJobs.some((j) => j.id === selectedJob.id)}
                  >
                    {appliedJobs.some((j) => j.id === selectedJob.id)
                      ? "Applied"
                      : "Apply"}
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
