import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const filters = {
  grayscale: "grayscale",
  sepia: "sepia",
  vintage: "brightness(1.1) contrast(1.1) saturate(1.3) sepia(0.2)",
};

const FontStyles = ["Arial", "Helvetica", "Times New Roman", "Courier", "Verdana"];

export default function App() {
  const [image, setImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [rotate, setRotate] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [filter, setFilter] = useState("");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontStyle, setFontStyle] = useState(FontStyles[0]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      applyEdits();
    }
  }, [image, crop, rotate, brightness, contrast, saturation, hue, filter, filterIntensity, text, fontSize, fontColor, fontStyle]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageLink = (e) => {
    e.preventDefault();
    const link = e.target.elements.imageLink.value;
    if (link) {
      setImage(link);
    }
  };

  const applyEdits = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply crop
      ctx.drawImage(
        img,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, canvas.width, canvas.height
      );

      // Apply rotate
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply adjustments
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`;
      
      // Apply selected filter
      if (filter) {
        ctx.filter += ` ${filters[filter]}(${filterIntensity}%)`;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Reset filter
      ctx.filter = "none";

      // Add text
      if (text) {
        ctx.font = `${fontSize}px ${fontStyle}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(text, 10, 50);
      }

      setEditedImage(canvas.toDataURL());
    };
    img.src = image;
  };

  const handleExport = (format) => {
    const link = document.createElement("a");
    link.download = `edited_image.${format}`;
    link.href = canvasRef.current.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Editor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Image Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
            <form onSubmit={handleImageLink} className="flex gap-2">
              <Input type="url" name="imageLink" placeholder="Image URL" />
              <Button type="submit">Load</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {editedImage && <img src={editedImage} alt="Edited" className="max-w-full h-auto" />}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label>Brightness</label>
                <Slider min={0} max={200} value={[brightness]} onValueChange={([value]) => setBrightness(value)} />
              </div>
              <div>
                <label>Contrast</label>
                <Slider min={0} max={200} value={[contrast]} onValueChange={([value]) => setContrast(value)} />
              </div>
              <div>
                <label>Saturation</label>
                <Slider min={0} max={200} value={[saturation]} onValueChange={([value]) => setSaturation(value)} />
              </div>
              <div>
                <label>Hue</label>
                <Slider min={0} max={360} value={[hue]} onValueChange={([value]) => setHue(value)} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(filters).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filter && (
              <div className="mt-2">
                <label>Filter Intensity</label>
                <Slider min={0} max={100} value={[filterIntensity]} onValueChange={([value]) => setFilterIntensity(value)} />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" className="mb-2" />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="Font size" />
              <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
            </div>
            <Select onValueChange={setFontStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent>
                {FontStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => handleExport("png")}>Export as PNG</Button>
              <Button onClick={() => handleExport("jpeg")}>Export as JPEG</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}