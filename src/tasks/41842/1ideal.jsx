import React, { useState } from "react";
// Import necessary components for UI
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Initial image dataset
const initialImages = [
  // Each image object contains details such as title, description, tags, etc.
  { id: 1, title: "Mountain Landscape", description: "A beautiful mountain landscape", date: "2023-06-15", tags: ["nature", "mountain"], url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" },
  // More images...
];

// Component to display individual image card
function ImageCard({ image, onClick }) {
  return (
    <Card className="cursor-pointer" onClick={() => onClick(image)}>
      <CardContent className="p-4">
        {/* Display the image */}
        <img src={image.url} alt={image.title} className="w-full h-48 object-cover rounded-md" />
      </CardContent>
      <CardFooter>
        {/* Display image title */}
        <p className="text-sm font-medium">{image.title}</p>
      </CardFooter>
    </Card>
  );
}

// Modal component to show image details
function ImageModal({ image, onClose }) {
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{image?.title}</DialogTitle>
          <DialogDescription>{image?.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Display full-sized image */}
          <img src={image?.url} alt={image?.title} className="w-full h-64 object-cover rounded-md" />
          <p>Date: {image?.date}</p>
          <p>Tags: {image?.tags.join(", ")}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Admin panel for managing images
function AdminPanel({ images, setImages }) {
  const [newImage, setNewImage] = useState({ title: "", description: "", date: "", url: "", tags: "" });
  const [error, setError] = useState("");

  // Function to validate URL format
  const isValidUrl = (url) => {
    const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    return regex.test(url);
  };

  // Handle input changes for the form
  const handleInputChange = (e) => {
    setNewImage({ ...newImage, [e.target.name]: e.target.value });
  };

  // Add a new image
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUrl(newImage.url)) {
      setError("Please enter a valid URL.");
      return;
    }
    const id = images.length + 1;
    const tags = newImage.tags.split(",").map(tag => tag.trim());
    setImages([...images, { ...newImage, id, tags }]);
    setNewImage({ title: "", description: "", date: "", url: "", tags: "" });
    setError("");
  };

  // Remove an image
  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Form for adding a new image */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={newImage.title} onChange={handleInputChange} placeholder="Title" required />
        <Input name="description" value={newImage.description} onChange={handleInputChange} placeholder="Description" required />
        <Input name="date" value={newImage.date} onChange={handleInputChange} type="date" required />
        <Input name="url" value={newImage.url} onChange={handleInputChange} placeholder="Image URL" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Input name="tags" value={newImage.tags} onChange={handleInputChange} placeholder="Tags (comma-separated)" required />
        <Button type="submit">Add Image</Button>
      </form>
      {/* List of current images with remove option */}
      <div className="space-y-2">
        {images.map(image => (
          <div key={image.id} className="flex justify-between items-center">
            <span>{image.title}</span>
            <Button onClick={() => handleRemove(image.id)} variant="destructive">Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main app component
export default function App() {
  const [images, setImages] = useState(initialImages); // State for images
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image in modal
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag filter
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date filter
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for dark mode toggle

  // Filter images based on search, tag, and date
  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(image =>
    selectedTag ? image.tags.includes(selectedTag) : true
  ).filter(image =>
    selectedDate ? image.date === selectedDate : true
  );

  // Extract unique tags from images
  const allTags = [...new Set(images.flatMap(image => image.tags))];

  return (
    <div className={`min-h-screen p-4 ${isDarkTheme ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Image Gallery</h1>
          <div className="flex items-center space-x-2">
            <Switch checked={isDarkTheme} onCheckedChange={setIsDarkTheme} />
            <Label>Dark Mode</Label>
          </div>
        </div>
        {/* Tabs for Gallery and Admin Panel */}
        <Tabs defaultValue="gallery" className="mb-4">
          <TabsList>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery">
            {/* Gallery view with filters */}
            <div className="space-y-4">
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {/* Tag filters */}
                <Button onClick={() => setSelectedTag("")} variant={selectedTag === "" ? "default" : "outline"}>All</Button>
                {allTags.map(tag => (
                  <Button key={tag} onClick={() => setSelectedTag(tag)} variant={selectedTag === tag ? "default" : "outline"}>{tag}</Button>
                ))}
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {/* Display filtered images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map(image => (
                  <ImageCard key={image.id} image={image} onClick={setSelectedImage} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="admin">
            {/* Admin Panel */}
            <AdminPanel images={images} setImages={setImages} />
          </TabsContent>
        </Tabs>
      </div>
      {/* Modal for image details */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
