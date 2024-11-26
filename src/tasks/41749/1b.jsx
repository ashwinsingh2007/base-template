import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function App() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [currentArtwork, setCurrentArtwork] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = isErasing ? '#ffffff' : color;
    context.lineWidth = isErasing ? brushSize * 2 : brushSize;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath();
  };

  const saveArtwork = () => {
    if (!currentArtwork) {
      const name = prompt('Please enter a name for your artwork:');
      if (name) {
        const newArtwork = { name, data: canvasRef.current.toDataURL() };
        setArtworks([...artworks, newArtwork]);
        setCurrentArtwork(newArtwork);
      }
    }
  };

  const newCanvas = () => {
    setCurrentArtwork(null);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const loadArtwork = (artwork) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
    img.src = artwork.data;
    setCurrentArtwork(artwork);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Canvas Draw</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={300} 
            onMouseDown={startDrawing} 
            onMouseMove={draw} 
            onMouseUp={endDrawing}
            className="border border-gray-300 bg-white"
          />
        </CardContent>
        <CardContent className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <Input type="number" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-20" />
            <Button onClick={() => setIsErasing(!isErasing)}>{isErasing ? 'Draw' : 'Erase'}</Button>
          </div>
          <div>
            <Button onClick={saveArtwork}>Save</Button>
            <Button onClick={newCanvas} className="ml-2">New</Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-lg space-y-4">
        {artworks.map((art, index) => (
          <Card key={index} className="cursor-pointer" onClick={() => loadArtwork(art)}>
            <CardContent>
              <CardTitle>{art.name}</CardTitle>
              <CardDescription>Click to load</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;