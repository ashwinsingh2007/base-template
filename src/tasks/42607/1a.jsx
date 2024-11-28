import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const EditorTools = ({ image, onAdjust }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Editing Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider label="Brightness" defaultValue={[50]} onValueChange={(v) => onAdjust('brightness', v[0])} />
          <Slider label="Contrast" defaultValue={[50]} onValueChange={(v) => onAdjust('contrast', v[0])} />
          <Slider label="Saturation" defaultValue={[50]} onValueChange={(v) => onAdjust('saturation', v[0])} />
          <Slider label="Hue" defaultValue={[0]} max={360} onValueChange={(v) => onAdjust('hue', v[0])} />
          <div>
            <label>Grayscale</label>
            <Switch onCheckedChange={(checked) => onAdjust('grayscale', checked)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ImageCanvas = ({ src, style }) => {
  return <img src={src} style={style} className="max-w-full h-auto" alt="Edited" />;
};

export default function App() {
  const [imageSrc, setImageSrc] = useState('https://unsplash.com/photos/a-woman-sitting-on-the-floor-looking-at-her-cell-phone-E-OdrK2aCBs/download?force=true');
  const [imageStyle, setImageStyle] = useState({});
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const applyAdjustments = (type, value) => {
    setImageStyle(prev => ({
      ...prev,
      filter: `${type}(${value}${type === 'hue' ? 'deg' : '%'})`
    }));
  };

  const exportImage = () => {
    const canvas = document.createElement('canvas');
    const img = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = getComputedStyle(img).filter;
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Photo Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={handleImageUpload} accept="image/*" />
          <ImageCanvas ref={canvasRef} src={imageSrc} style={imageStyle} />
          <EditorTools onAdjust={applyAdjustments} />
          <Button onClick={exportImage}>Export Image</Button>
        </CardContent>
      </Card>
    </div>
  );
}