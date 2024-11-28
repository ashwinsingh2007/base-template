import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const filters = {
  grayscale: "grayscale",
  sepia: "sepia",
  vintage: "brightness(1.1) contrast(1.1) saturate(1.3) sepia(0.2)",
};

const overlays = {
  none: "none",
  gradient: "linear-gradient(45deg, rgba(255,0,0,0.5), rgba(0,0,255,0.5))",
  pattern: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\"><circle cx=\"5\" cy=\"5\" r=\"2\" fill=\"black\" fill-opacity=\"0.1\"/></svg>')",
};

export default function App() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [filter, setFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [overlay, setOverlay] = useState("none");
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      applyEdits();
    }
  }, [image, brightness, contrast, saturation, hue, filter, filterIntensity, overlay, crop, rotation]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setCrop({ x: 0, y: 0, width: img.width, height: img.height });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyEdits = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) ${filters[filter] || ""} opacity(${filterIntensity}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -crop.x, -crop.y, image.width, image.height);
    ctx.resetTransform();

    if (overlay !== "none") {
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = overlays[overlay];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setEditedImage(canvas.toDataURL());
  };

  const exportImage = (format) => {
    const link = document.createElement("a");
    link.download = `edited_image.${format}`;
    link.href = canvasRef.current.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Editor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input type="file" onChange={handleImageUpload} accept="image/*" className="mb-4" />
          {image && (
            <div className="relative">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Brightness</label>
            <Slider min={0} max={200} value={[brightness]} onValueChange={(v) => setBrightness(v[0])} />
          </div>
          <div>
            <label className="block mb-2">Contrast</label>
            <Slider min={0} max={200} value={[contrast]} onValueChange={(v) => setContrast(v[0])} />
          </div>
          <div>
            <label className="block mb-2">Saturation</label>
            <Slider min={0} max={200} value={[saturation]} onValueChange={(v) => setSaturation(v[0])} />
          </div>
          <div>
            <label className="block mb-2">Hue</label>
            <Slider min={0} max={360} value={[hue]} onValueChange={(v) => setHue(v[0])} />
          </div>
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
          <div>
            <label className="block mb-2">Filter Intensity</label>
            <Slider min={0} max={100} value={[filterIntensity]} onValueChange={(v) => setFilterIntensity(v[0])} />
          </div>
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
          <div>
            <label className="block mb-2">Rotation</label>
            <Slider min={0} max={360} value={[rotation]} onValueChange={(v) => setRotation(v[0])} />
          </div>
          <div>
            <label className="block mb-2">Crop</label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: parseInt(e.target.value) })} placeholder="X" />
              <Input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: parseInt(e.target.value) })} placeholder="Y" />
              <Input type="number" value={crop.width} onChange={(e) => setCrop({ ...crop, width: parseInt(e.target.value) })} placeholder="Width" />
              <Input type="number" value={crop.height} onChange={(e) => setCrop({ ...crop, height: parseInt(e.target.value) })} placeholder="Height" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => exportImage("png")}>Export PNG</Button>
            <Button onClick={() => exportImage("jpeg")}>Export JPEG</Button>
          </div>
        </div>
      </div>
    </div>
  );
}