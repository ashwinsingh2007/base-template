import React, { useState, useRef, useEffect } from "react"; // Importing necessary React hooks and components
import { Slider } from "@/components/ui/slider"; // Importing a Slider component for controlling image properties
import { Button } from "@/components/ui/button"; // Importing a Button component for actions
import { Input } from "@/components/ui/input"; // Importing an Input component for user input fields
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importing Select components for dropdowns

// Defining filter options with their respective CSS filter properties
const filters = {
  grayscale: "grayscale",
  sepia: "sepia",
  vintage: "brightness(1.1) contrast(1.1) saturate(1.3) sepia(0.2)",
};

// Defining overlay options with CSS gradients and patterns
const overlays = {
  none: "none",
  gradient: "linear-gradient(45deg, rgba(255,0,0,0.5), rgba(0,0,255,0.5))",
  pattern: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\"><circle cx=\"5\" cy=\"5\" r=\"2\" fill=\"black\" fill-opacity=\"0.1\"/></svg>')",
};

export default function App() {
  // Defining state variables for managing image properties and UI state
  const [image, setImage] = useState(null); // Stores the uploaded image
  const [imageUrl, setImageUrl] = useState(""); // Stores the URL for an image
  const [brightness, setBrightness] = useState(100); // Controls image brightness
  const [contrast, setContrast] = useState(100); // Controls image contrast
  const [saturation, setSaturation] = useState(100); // Controls image saturation
  const [hue, setHue] = useState(0); // Controls hue rotation
  const [filter, setFilter] = useState("none"); // Stores the selected filter
  const [filterIntensity, setFilterIntensity] = useState(100); // Controls filter intensity
  const [overlay, setOverlay] = useState("none"); // Stores the selected overlay
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 }); // Defines cropping dimensions
  const [rotation, setRotation] = useState(0); // Controls image rotation
  const [resize, setResize] = useState({ width: 500, height: 500 }); // Defines resizing dimensions
  const canvasRef = useRef(null); // Reference to the canvas for drawing the image

  // useEffect to apply edits whenever relevant state variables change
  useEffect(() => {
    if (image) {
      applyEdits(); // Apply edits to the image whenever state changes
    }
  }, [image, brightness, contrast, saturation, hue, filter, filterIntensity, overlay, crop, rotation, resize]);

  // Handle image upload from file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img); // Set the loaded image
        setCrop({ x: 0, y: 0, width: img.width, height: img.height }); // Set initial cropping dimensions
        setResize({ width: img.width, height: img.height }); // Set initial resizing dimensions
      };
      img.src = event.target.result; // Set image source
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  // Handle loading image from a URL
  const handleImageLink = () => {
    if (!imageUrl) return;
    const img = new Image();
    img.onload = () => {
      setImage(img); // Set the loaded image
      setCrop({ x: 0, y: 0, width: img.width, height: img.height }); // Set cropping dimensions
      setResize({ width: img.width, height: img.height }); // Set resizing dimensions
    };
    img.onerror = () => {
      alert("Failed to load image. Please check the URL and try again."); // Handle errors
    };
    img.src = imageUrl; // Set image source
  };

  // Apply edits to the image and draw it on the canvas
  const applyEdits = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = resize.width; // Set canvas width
    canvas.height = resize.height; // Set canvas height

    // Apply filter effects to the context
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) ${filters[filter] || ""} opacity(${filterIntensity}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); // Translate to the center for rotation
    ctx.rotate((rotation * Math.PI) / 180); // Apply rotation
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      -resize.width / 2,
      -resize.height / 2,
      resize.width,
      resize.height
    );
    ctx.resetTransform(); // Reset transformations

    // Apply overlays if selected
    if (overlay !== "none") {
      ctx.globalCompositeOperation = "source-over";
      if (overlay === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgba(255,0,0,0.5)");
        gradient.addColorStop(1, "rgba(0,0,255,0.5)");
        ctx.fillStyle = gradient;
      } else if (overlay === "pattern") {
        const patternCanvas = document.createElement("canvas");
        patternCanvas.width = 10; // Pattern width
        patternCanvas.height = 10; // Pattern height
        const patternCtx = patternCanvas.getContext("2d");
        patternCtx.fillStyle = "rgba(0,0,0,0.1)"; // Pattern color
        patternCtx.beginPath();
        patternCtx.arc(5, 5, 2, 0, Math.PI * 2); // Draw a circle
        patternCtx.fill();
        ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat"); // Set pattern
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the overlay
    }
  };

  // Export the edited image in the specified format
  const exportImage = (format) => {
    const link = document.createElement("a");
    link.download = `edited_image.${format}`; // Set download filename
    link.href = canvasRef.current.toDataURL(`image/${format}`); // Get the image data URL
    link.click(); // Trigger download
  };

  // Rendering the UI
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Editor</h1> {/* Page title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* File input for uploading an image */}
          <Input type="file" onChange={handleImageUpload} accept="image/*" className="mb-4" />
          {/* Input and button for loading image via URL */}
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={handleImageLink}>Load</Button>
          </div>
          {/* Display the canvas only when an image is loaded */}
          {image && (
            <div className="relative">
              <canvas ref={canvasRef} className="w-full h-auto border" />
            </div>
          )}
        </div>
        {/* Control panel for image editing */}
        <div className="space-y-4">
          {/* Brightness control */}
          <div>
            <label className="block mb-2">Brightness</label>
            <Slider min={0} max={200} value={[brightness]} onValueChange={(v) => setBrightness(v[0])} />
          </div>
          {/* Contrast control */}
          <div>
            <label className="block mb-2">Contrast</label>
            <Slider min={0} max={200} value={[contrast]} onValueChange={(v) => setContrast(v[0])} />
          </div>
          {/* Saturation control */}
          <div>
            <label className="block mb-2">Saturation</label>
            <Slider min={0} max={200} value={[saturation]} onValueChange={(v) => setSaturation(v[0])} />
          </div>
          {/* Hue control */}
          <div>
            <label className="block mb-2">Hue</label>
            <Slider min={0} max={360} value={[hue]} onValueChange={(v) => setHue(v[0])} />
          </div>
          {/* Filter selection */}
          <div>
            <label className="block mb-2">Filter</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Overlay selection */}
          <div>
            <label className="block mb-2">Overlay</label>
            <Select value={overlay} onValueChange={setOverlay}>
              <SelectTrigger>
                <SelectValue placeholder="Select an overlay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="pattern">Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Crop inputs */}
          <div>
            <label className="block mb-2">Crop</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={crop.x}
                onChange={(e) => setCrop({ ...crop, x: parseInt(e.target.value) || 0 })}
                placeholder="X"
              />
              <Input
                type="number"
                value={crop.y}
                onChange={(e) => setCrop({ ...crop, y: parseInt(e.target.value) || 0 })}
                placeholder="Y"
              />
              <Input
                type="number"
                value={crop.width}
                onChange={(e) => setCrop({ ...crop, width: parseInt(e.target.value) || 100 })}
                placeholder="Width"
              />
              <Input
                type="number"
                value={crop.height}
                onChange={(e) => setCrop({ ...crop, height: parseInt(e.target.value) || 100 })}
                placeholder="Height"
              />
            </div>
          </div>
          {/* Rotation control */}
          <div>
            <label className="block mb-2">Rotation</label>
            <Slider min={0} max={360} value={[rotation]} onValueChange={(v) => setRotation(v[0])} />
          </div>
          {/* Export buttons */}
          <div className="flex space-x-2">
            <Button onClick={() => exportImage("png")}>Export PNG</Button>
            <Button onClick={() => exportImage("jpeg")}>Export JPEG</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
