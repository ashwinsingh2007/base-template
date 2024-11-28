import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Switch } from "@/components/ui";
import { cn } from "@/lib/utils";

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  const exportFile = (type) => {
    const blob = new Blob([type === 'md' ? markdown : `<html><body>${markdownToHtml(markdown)}</body></html>`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `document.${type}`;
    a.click();
  };

  const markdownToHtml = (md) => {
    // Basic markdown to HTML conversion without external libraries
    return md
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^>(.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br />');
  };

  const countWords = (text) => text.split(/\s+/).filter(word => word).length;
  const countCharacters = (text) => text.length;
  const analyzeComplexity = (text) => {
    const sentences = text.split(/[.!?]+/).length;
    const words = countWords(text);
    return sentences > 0 ? words / sentences : 0;
  };

  return (
    <div className={cn("flex flex-col h-screen", isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800")}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Markdown Editor</h1>
        <div className="flex items-center">
          <Switch onCheckedChange={() => setIsDarkMode(!isDarkMode)} className="mr-4" />
          <Button onClick={() => setIsVertical(!isVertical)}>
            {isVertical ? 'Horizontal' : 'Vertical'}
          </Button>
        </div>
      </header>

      <div className={cn("flex-1 flex", isVertical ? "flex-col" : "flex-row")}>
        <div className={cn("w-full", isVertical ? "h-1/2" : "w-1/2", "border-r border-b border-gray-300 dark:border-gray-700")}>
          <Card>
            <CardHeader>
              <CardTitle>Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                value={markdown} 
                onChange={handleMarkdownChange} 
                className="w-full h-full p-2 resize-none bg-transparent border-none focus:outline-none"
                placeholder="Write your Markdown here..."
              />
            </CardContent>
          </Card>
          <div className="p-4">
            <p>Characters: {countCharacters(markdown)}</p>
            <p>Words: {countWords(markdown)}</p>
            <p>Sentence Complexity: {analyzeComplexity(markdown).toFixed(2)}</p>
          </div>
        </div>
        <div className={cn("w-full", isVertical ? "h-1/2" : "w-1/2")}>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 flex justify-center space-x-4">
        <Button onClick={() => exportFile('md')}>Export as .md</Button>
        <Button onClick={() => exportFile('html')}>Export as .html</Button>
        <Button onClick={() => setActiveTab(activeTab === 'editor' ? 'cheatsheet' : 'editor')}>
          {activeTab === 'editor' ? 'Show Cheatsheet' : 'Back to Editor'}
        </Button>
      </div>

      {activeTab === 'cheatsheet' && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Markdown Cheatsheet</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li><strong># Heading</strong> for H1</li>
                <li><strong>## Heading</strong> for H2</li>
                <li><strong>**bold text**</strong> for bold</li>
                <li><strong>*italic text*</strong> for italic</li>
                <li><strong>[link](url)</strong> for links</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return <MarkdownEditor />;
}