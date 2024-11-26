import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Predefined colors for the color picker
const predefinedColors = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
];

// Canvas component to handle drawing operations
const Canvas = ({ color, brushSize, isEraser, onSave }) => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state

  useEffect(() => {
    // Initialize canvas context settings
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round"; // Make line ends rounded
    ctx.lineJoin = "round"; // Make line joints rounded
  }, []);

  // Start drawing on mouse down
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    ); // Start point
    setIsDrawing(true);
  };

  // Draw on the canvas as the mouse moves
  const draw = (e) => {
    if (!isDrawing) return; // If not in drawing mode, exit
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = brushSize; // Set brush size
    ctx.strokeStyle = isEraser ? "#FFFFFF" : color; // Use white for eraser
    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    ); // Draw to the current point
    ctx.stroke();
  };

  // Stop drawing on mouse up or out
  const stopDrawing = () => {
    setIsDrawing(false); // End drawing mode
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="border border-gray-300 cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
    />
  );
};

// ColorPicker component for selecting brush colors
const ColorPicker = ({ color, setColor }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Predefined color options */}
      {predefinedColors.map((c) => (
        <div
          key={c}
          className={`w-8 h-8 rounded-full cursor-pointer ${
            color === c ? "ring-2 ring-blue-500" : ""
          }`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)} // Set selected color
        />
      ))}
      {/* Custom color picker */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)} // Update color on change
        className="w-8 h-8"
      />
    </div>
  );
};

// Main application component
export default function App() {
  const [color, setColor] = useState("#000000"); // Default brush color
  const [brushSize, setBrushSize] = useState(5); // Default brush size
  const [isEraser, setIsEraser] = useState(false); // Eraser toggle
  const [artworks, setArtworks] = useState([]); // List of saved artworks
  const [currentArtwork, setCurrentArtwork] = useState(null); // Current loaded artwork
  const [artworkName, setArtworkName] = useState(""); // Name for the artwork

  // Save the current canvas drawing as an artwork
  const handleSave = () => {
    if (!artworkName) return; // Ensure artwork has a name
    const canvas = document.querySelector("canvas");
    const newArtwork = {
      name: artworkName, // Artwork name
      data: canvas.toDataURL(), // Canvas image data
    };
    setArtworks([...artworks, newArtwork]); // Add to saved artworks
    setArtworkName(""); // Reset artwork name
  };

  // Load a saved artwork onto the canvas
  const handleLoad = (artwork) => {
    setCurrentArtwork(artwork);
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.drawImage(img, 0, 0); // Draw saved image
    };
    img.src = artwork.data; // Set image source
  };

  // Clear the canvas to start a new drawing
  const handleNew = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    setCurrentArtwork(null); // Reset current artwork
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Drawing App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Canvas and drawing tools */}
        <div>
          <Canvas
            color={color}
            brushSize={brushSize}
            isEraser={isEraser}
          />
          <div className="mt-4">
            {/* Color picker component */}
            <ColorPicker color={color} setColor={setColor} />
            <div className="mt-2">
              {/* Brush size slider */}
              <label className="block text-sm font-medium text-gray-700">
                Brush Size
              </label>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                max={20} // Maximum brush size
                step={1} // Step size
              />
            </div>
            <div className="mt-2">
              {/* Eraser toggle button */}
              <Button
                onClick={() => setIsEraser(!isEraser)}
                variant={isEraser ? "destructive" : "outline"}
              >
                {isEraser ? "Eraser" : "Brush"}
              </Button>
            </div>
          </div>
        </div>
        {/* Artwork management */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Save Artwork</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Input for artwork name */}
              <Input
                placeholder="Artwork name"
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              {/* Save artwork button */}
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Saved Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Dropdown to load saved artworks */}
              <Select onValueChange={handleLoad}>
                <SelectTrigger>
                  <SelectValue placeholder="Select artwork" />
                </SelectTrigger>
                <SelectContent>
                  {artworks.map((artwork, index) => (
                    <SelectItem key={index} value={artwork}>
                      {artwork.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              {/* New canvas button */}
              <Button onClick={handleNew}>New Canvas</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
