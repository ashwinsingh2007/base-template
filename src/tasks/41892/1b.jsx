import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const markdownToHtml = (markdown) => {
  // Basic Markdown to HTML conversion (simplified for brevity)
  return markdown
    .replace(/# (.*$)/gim, '<h1>$1</h1>')
    .replace(/## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n/gim, '<br>');
};

const analyzeText = (text) => {
  const words = text.trim().split(/\s+/).length;
  const characters = text.length;
  const sentences = text.split(/[.!?]+/).length;
  const complexityScore = (words / sentences).toFixed(2);
  return { words, characters, complexityScore };
};

const MarkdownEditor = ({ darkMode, splitView }) => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor");
  const [html, setHtml] = useState("");
  const [stats, setStats] = useState({ words: 0, characters: 0, complexityScore: 0 });

  useEffect(() => {
    setHtml(markdownToHtml(markdown));
    setStats(analyzeText(markdown));
  }, [markdown]);

  const handleExport = (type) => {
    const content = type === 'md' ? markdown : html;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex ${splitView ? 'flex-col sm:flex-row' : 'flex-col'} h-full`}>
      <div className={`flex-1 p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <textarea
          className={`w-full h-full p-2 resize-none outline-none ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>
      <div className={`flex-1 p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="absolute bottom-4 left-4 space-x-2">
        <Button onClick={() => handleExport('md')}>Export .md</Button>
        <Button onClick={() => handleExport('html')}>Export .html</Button>
      </div>
      <div className="absolute bottom-4 right-4">
        <p>Words: {stats.words}</p>
        <p>Characters: {stats.characters}</p>
        <p>Complexity: {stats.complexityScore}</p>
      </div>
    </div>
  );
};

const CheatSheet = () => (
  <Card>
    <CardHeader>
      <CardTitle>Markdown Cheatsheet</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5">
        <li># Heading 1</li>
        <li>## Heading 2</li>
        <li>**Bold**</li>
        <li>*Italic*</li>
        <li>[Link](http://example.com)</li>
        <li>- List item</li>
      </ul>
    </CardContent>
  </Card>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [splitView, setSplitView] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Markdown Editor</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="split-view" checked={splitView} onCheckedChange={setSplitView} />
              <Label htmlFor="split-view">Split View</Label>
            </div>
          </div>
        </div>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-[calc(100vh-200px)]">
            <MarkdownEditor darkMode={darkMode} splitView={splitView} />
          </TabsContent>
          <TabsContent value="cheatsheet">
            <CheatSheet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}