import React, { useState, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Switch } from "@/components/ui";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [columns, setColumns] = useState([
    { id: 1, name: 'To Do', tasks: [] },
    { id: 2, name: 'In Progress', tasks: [] },
    { id: 3, name: 'Done', tasks: [] }
  ]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = useCallback((e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = parseInt(e.dataTransfer.getData("columnId"));
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const targetColumn = newColumns.find(col => col.id === targetColumnId);
      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      const [task] = sourceColumn.tasks.splice(taskIndex, 1);
      targetColumn.tasks.push({...task, priority: task.priority || 'Medium'});
      return newColumns;
    });
  }, []);

  const addTask = (columnId, taskName) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, tasks: [...col.tasks, { id: Date.now().toString(), name: taskName, priority: 'Medium' }] } : col
    ));
  };

  const addColumn = () => {
    setColumns(prev => [...prev, { id: Date.now(), name: `Column ${prev.length + 1}`, tasks: [] }]);
  };

  const deleteColumn = (id) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  const renameColumn = (id, newName) => {
    setColumns(prev => prev.map(col => col.id === id ? { ...col, name: newName } : col));
  };

  const Task = ({ task, columnId }) => (
    <Card 
      className="mb-2 p-2 cursor-move" 
      draggable 
      onDragStart={e => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("columnId", columnId);
      }}
    >
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div className={`p-1 rounded-full text-center w-16 ${{
          'High': 'bg-red-200 text-red-800',
          'Medium': 'bg-yellow-200 text-yellow-800',
          'Low': 'bg-green-200 text-green-800'
        }[task.priority]}`}>
          {task.priority}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Switch onCheckedChange={setDarkMode} checked={darkMode} className="ml-4">Dark Mode</Switch>
      </div>
      <div className="flex flex-wrap gap-4">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="flex-1 min-w-[280px] max-w-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card>
              <CardHeader className="flex justify-between items-center">
                <Input 
                  defaultValue={column.name} 
                  onBlur={(e) => renameColumn(column.id, e.target.value)} 
                  className="text-lg font-semibold"
                />
                <Button variant="destructive" size="icon" onClick={() => deleteColumn(column.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              </CardHeader>
              <CardContent>
                {column.tasks.map(task => <Task key={task.id} task={task} columnId={column.id} />)}
                <Button onClick={() => addTask(column.id, 'New Task')} className="mt-2 w-full">Add Task</Button>
              </CardContent>
            </Card>
          </div>
        ))}
        <Button onClick={addColumn} className="h-10 w-48 self-center">Add Column</Button>
      </div>
    </div>
  );
}

export default App;