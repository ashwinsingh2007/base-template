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

const predefinedColors = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

const Canvas = ({ color, brushSize, isEraser, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? "#FFFFFF" : color;
    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
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

const ColorPicker = ({ color, setColor }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {predefinedColors.map((c) => (
        <div
          key={c}
          className={`w-8 h-8 rounded-full cursor-pointer ${
            color === c ? "ring-2 ring-blue-500" : ""
          }`}
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        />
      ))}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8"
      />
    </div>
  );
};

export default function App() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [currentArtwork, setCurrentArtwork] = useState(null);
  const [artworkName, setArtworkName] = useState("");

  const handleSave = () => {
    if (!artworkName) return;
    const canvas = document.querySelector("canvas");
    const newArtwork = {
      name: artworkName,
      data: canvas.toDataURL(),
    };
    setArtworks([...artworks, newArtwork]);
    setArtworkName("");
  };

  const handleLoad = (artwork) => {
    setCurrentArtwork(artwork);
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = artwork.data;
  };

  const handleNew = () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCurrentArtwork(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Drawing App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Canvas
            color={color}
            brushSize={brushSize}
            isEraser={isEraser}
          />
          <div className="mt-4">
            <ColorPicker color={color} setColor={setColor} />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Brush Size
              </label>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                max={20}
                step={1}
              />
            </div>
            <div className="mt-2">
              <Button
                onClick={() => setIsEraser(!isEraser)}
                variant={isEraser ? "destructive" : "outline"}
              >
                {isEraser ? "Eraser" : "Brush"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Save Artwork</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Artwork name"
                value={artworkName}
                onChange={(e) => setArtworkName(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Saved Artworks</CardTitle>
            </CardHeader>
            <CardContent>
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
              <Button onClick={handleNew}>New Canvas</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}