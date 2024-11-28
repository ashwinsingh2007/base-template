import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to convert Markdown syntax to HTML
const markdownToHtml = (markdown) => {
  // Replace various Markdown syntax with corresponding HTML tags
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>') // Convert H1 headings
    .replace(/^## (.*$)/gim, '<h2>$1</h2>') // Convert H2 headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>') // Convert H3 headings
    .replace(/^\- (.*$)/gim, '<li>$1</li>') // Convert list items
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>') // Convert bold text
    .replace(/\*(.*?)\*/gim, '<em>$1</em>') // Convert italic text
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>') // Convert links
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>') // Convert unordered lists
    .replace(/\n/gim, '<br>'); // Replace newlines with <br> tags
};

// Function to analyze text for statistics like word and character counts
const analyzeText = (text) => {
  const trimmedText = text.trim(); // Remove whitespace from start and end
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0; // Count words
  const characters = trimmedText.replace(/\s/g, "").length; // Count characters excluding spaces
  const sentences = trimmedText.split(/[.!?]+/).filter(Boolean).length; // Count sentences
  const complexityScore = sentences ? (words / sentences).toFixed(2) : "0.00"; // Calculate complexity score
  return { words, characters, complexityScore }; // Return the analyzed stats
};

// Main MarkdownEditor component
const MarkdownEditor = ({ darkMode, splitView }) => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor"); // Markdown input state
  const [html, setHtml] = useState(""); // Converted HTML output state
  const [stats, setStats] = useState({ words: 0, characters: 0, complexityScore: "0.00" }); // Text stats state

  useEffect(() => {
    // Update HTML and stats whenever the markdown changes
    setHtml(markdownToHtml(markdown));
    setStats(analyzeText(markdown));
  }, [markdown]);

  // Function to handle exporting content as a file
  const handleExport = (type) => {
    const content = type === "md" ? markdown : html; // Determine export type
    const blob = new Blob([content], { type: "text/plain" }); // Create a file blob
    const url = URL.createObjectURL(blob); // Create a URL for the blob
    const a = document.createElement("a"); // Create a temporary anchor tag
    a.href = url;
    a.download = `export.${type}`; // Set the download filename
    a.click(); // Trigger the download
    URL.revokeObjectURL(url); // Revoke the blob URL after download
  };

  return (
    <div className={`flex ${splitView ? "flex-col sm:flex-row" : "flex-col"} h-full`}>
      {/* Markdown editor textarea */}
      <div className={`flex-1 p-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <textarea
          className={`w-full h-full p-2 resize-none outline-none ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)} // Update markdown state
        />
      </div>
      {/* Rendered HTML preview */}
      <div className={`flex-1 p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} /> {/* Inject HTML directly */}
      </div>
      {/* Export buttons */}
      <div className="absolute bottom-4 left-4 space-x-2">
        <Button onClick={() => handleExport("md")}>Export .md</Button>
        <Button onClick={() => handleExport("html")}>Export .html</Button>
      </div>
      {/* Display word, character, and complexity stats */}
      <div className="absolute bottom-4 right-4">
        <p>Words: {stats.words}</p>
        <p>Characters: {stats.characters}</p>
        <p>Complexity: {stats.complexityScore}</p>
      </div>
    </div>
  );
};

// Markdown Cheatsheet component
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

// Main App component
export default function App() {
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle state
  const [splitView, setSplitView] = useState(true); // Split view toggle state

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto p-4">
        {/* Header with title and toggles */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Markdown Editor</h1>
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            {/* Split view toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="split-view" checked={splitView} onCheckedChange={setSplitView} />
              <Label htmlFor="split-view">Split View</Label>
            </div>
          </div>
        </div>
        {/* Tabs for editor and cheatsheet */}
        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-[calc(100vh-200px)]">
            {/* Render Markdown Editor */}
            <MarkdownEditor darkMode={darkMode} splitView={splitView} />
          </TabsContent>
          <TabsContent value="cheatsheet">
            {/* Render Markdown Cheatsheet */}
            <CheatSheet />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
