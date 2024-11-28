import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Modal, Switch } from "@/components/ui";
import { cn } from "@/lib/utils";

const images = [
  { id: 1, title: "Sunset", description: "A beautiful sunset over the sea", date: "2023-01-01", tags: ["nature", "sunset"], url: "sunset.jpg" },
  { id: 2, title: "Mountain", description: "Snowy peak in the morning light", date: "2023-02-15", tags: ["mountain", "snow"], url: "mountain.jpg" },
  // Add 8 more images here for a total of 10
];

function ImageModal({ image, onClose }) {
  return (
    <Modal open={!!image} onOpenChange={onClose}>
      <Modal.Content>
        <Card>
          <img src={image?.url} alt={image?.title} className="w-full h-64 object-cover" />
          <CardHeader>
            <CardTitle>{image?.title}</CardTitle>
            <CardDescription>{image?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Uploaded on: {image?.date}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {image?.tags.map(tag => <span key={tag} className="bg-secondary px-2 py-1 rounded-full text-xs">{tag}</span>)}
            </div>
          </CardContent>
        </Card>
      </Modal.Content>
    </Modal>
  );
}

function AdminPanel({ onAddImage, onRemoveImage }) {
  const [newImage, setNewImage] = useState({ title: '', description: '', date: '', url: '', tags: '' });
  const [toRemove, setToRemove] = useState(null);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} required />
          {/* Add similar inputs for description, date, url, tags */}
          <Button onClick={() => onAddImage(newImage)} className="mt-2">Add Image</Button>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Remove Image</CardTitle>
        </CardHeader>
        <CardContent>
          {images.map(img => (
            <div key={img.id} className="flex justify-between items-center">
              <span>{img.title}</span>
              <Button onClick={() => setToRemove(img)}>Remove</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Modal open={!!toRemove} onOpenChange={() => setToRemove(null)}>
        <Modal.Content>
          <p>Are you sure you want to remove {toRemove?.title}?</p>
          <Button onClick={() => onRemoveImage(toRemove.id)}>Confirm</Button>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const addImage = (image) => {
    images.push({ id: images.length + 1, ...image });
  };

  const removeImage = (id) => {
    const index = images.findIndex(img => img.id === id);
    if (index > -1) images.splice(index, 1);
  };

  const filteredImages = images.filter(img => 
    img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    img.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(img => !filterTag || img.tags.includes(filterTag));

  return (
    <div className={cn("min-h-screen p-4", darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
      <Switch checked={darkMode} onCheckedChange={setDarkMode} className="mb-4 float-right">Dark Mode</Switch>
      <Button onClick={() => setIsAdmin(!isAdmin)}>{isAdmin ? 'User View' : 'Admin View'}</Button>
      {isAdmin ? (
        <AdminPanel onAddImage={addImage} onRemoveImage={removeImage} />
      ) : (
        <>
          <Input 
            placeholder="Search by title or description..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full sm:w-1/2"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', ...new Set(images.flatMap(i => i.tags))].map(tag => (
              <Button key={tag} onClick={() => setFilterTag(tag === 'all' ? '' : tag)} variant={tag === filterTag ? 'default' : 'outline'}>
                {tag}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map(image => (
              <Card key={image.id} onClick={() => setViewImage(image)}>
                <img src={image.url} alt={image.title} className="h-48 w-full object-cover" />
                <CardFooter>
                  <p>{image.title}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <ImageModal image={viewImage} onClose={() => setViewImage(null)} />
        </>
      )}
    </div>
  );
}