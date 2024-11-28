import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const initialImages = [
  { id: 1, title: "Mountain Landscape", description: "A beautiful mountain landscape", date: "2023-06-15", tags: ["nature", "mountain"], url: "https://example.com/mountain.jpg" },
  { id: 2, title: "City Skyline", description: "A stunning city skyline at night", date: "2023-07-01", tags: ["city", "night"], url: "https://example.com/city.jpg" },
  // Add 8 more images here...
];

function ImageCard({ image, onClick }) {
  return (
    <Card className="cursor-pointer" onClick={() => onClick(image)}>
      <CardContent className="p-4">
        <img src={image.url} alt={image.title} className="w-full h-48 object-cover rounded-md" />
      </CardContent>
      <CardFooter>
        <p className="text-sm font-medium">{image.title}</p>
      </CardFooter>
    </Card>
  );
}

function ImageModal({ image, onClose }) {
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{image?.title}</DialogTitle>
          <DialogDescription>{image?.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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

function AdminPanel({ images, setImages }) {
  const [newImage, setNewImage] = useState({ title: "", description: "", date: "", url: "", tags: "" });

  const handleInputChange = (e) => {
    setNewImage({ ...newImage, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = images.length + 1;
    const tags = newImage.tags.split(",").map(tag => tag.trim());
    setImages([...images, { ...newImage, id, tags }]);
    setNewImage({ title: "", description: "", date: "", url: "", tags: "" });
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={newImage.title} onChange={handleInputChange} placeholder="Title" required />
        <Input name="description" value={newImage.description} onChange={handleInputChange} placeholder="Description" required />
        <Input name="date" value={newImage.date} onChange={handleInputChange} type="date" required />
        <Input name="url" value={newImage.url} onChange={handleInputChange} placeholder="Image URL" required />
        <Input name="tags" value={newImage.tags} onChange={handleInputChange} placeholder="Tags (comma-separated)" required />
        <Button type="submit">Add Image</Button>
      </form>
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

export default function App() {
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(image =>
    selectedTag ? image.tags.includes(selectedTag) : true
  ).filter(image =>
    selectedDate ? image.date === selectedDate : true
  );

  const allTags = [...new Set(images.flatMap(image => image.tags))];

  return (
    <div className={`min-h-screen p-4 ${isDarkTheme ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Image Gallery</h1>
          <div className="flex items-center space-x-2">
            <Switch checked={isDarkTheme} onCheckedChange={setIsDarkTheme} />
            <Label>Dark Mode</Label>
          </div>
        </div>
        <Tabs defaultValue="gallery" className="mb-4">
          <TabsList>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery">
            <div className="space-y-4">
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex space-x-2 overflow-x-auto pb-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map(image => (
                  <ImageCard key={image.id} image={image} onClick={setSelectedImage} />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="admin">
            <AdminPanel images={images} setImages={setImages} />
          </TabsContent>
        </Tabs>
      </div>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}