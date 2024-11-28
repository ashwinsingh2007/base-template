import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define priority styles
const priorities = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-400 text-black",
  Low: "bg-green-500 text-white",
};

// Initial default columns
const defaultColumns = [
  { id: 1, title: "To Do", tasks: [] },
  { id: 2, title: "In Progress", tasks: [] },
  { id: 3, title: "Done", tasks: [] },
];

function App() {
  const [columns, setColumns] = useState(defaultColumns); // State to hold columns and tasks
  const [draggedTask, setDraggedTask] = useState(null); // State to track dragged task for drag-and-drop
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme toggle

  // Add a new column
  const addColumn = () => {
    const newColumn = { id: Date.now(), title: "New Column", tasks: [] };
    setColumns([...columns, newColumn]);
  };

  // Delete a column by ID
  const deleteColumn = (id) => {
    setColumns(columns.filter((column) => column.id !== id));
  };

  // Update column title
  const updateColumnTitle = (id, newTitle) => {
    setColumns(
      columns.map((column) =>
        column.id === id ? { ...column, title: newTitle } : column
      )
    );
  };

  // Add a new task to a specific column
  const addTask = (columnId) => {
    const taskTitle = prompt("Enter task title:");
    if (!taskTitle) return;
    const priority = prompt("Enter priority (High, Medium, Low):") || "Medium";
    const newTask = { id: Date.now(), title: taskTitle, priority };
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  // Edit an existing task
  const editTask = (columnId, taskId) => {
    const taskTitle = prompt("Edit task title:");
    if (!taskTitle) return;
    const priority = prompt("Edit priority (High, Medium, Low):") || "Medium";
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, title: taskTitle, priority }
                  : task
              ),
            }
          : column
      )
    );
  };

  // Delete a task from a specific column
  const deleteTask = (columnId, taskId) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            }
          : column
      )
    );
  };

  // Handle drag start for a task
  const handleDragStart = (task, columnId) => {
    setDraggedTask({ ...task, columnId });
  };

  // Handle drop of a task into a column
  const handleDrop = (columnId) => {
    if (!draggedTask) return;

    // Update the columns to reflect the task's new position
    setColumns(
      columns.map((column) => {
        if (column.id === draggedTask.columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== draggedTask.id),
          };
        }
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, draggedTask],
          };
        }
        return column;
      })
    );

    // Clear dragged task state
    setDraggedTask(null);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <div
      className={`min-h-screen p-4 ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header Section */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={toggleTheme}
        >
          Toggle {isDarkTheme ? "Light" : "Dark"} Theme
        </button>
      </header>

      {/* Kanban Board Columns */}
      <div className="flex gap-4 overflow-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className="w-80 flex-shrink-0"
            onDragOver={(e) => e.preventDefault()} // Allow drag over
            onDrop={() => handleDrop(column.id)} // Handle drop event
          >
            <Card>
              {/* Column Header */}
              <CardHeader>
                <input
                  className="text-lg font-bold w-full bg-transparent border-b border-gray-300 focus:outline-none"
                  value={column.title}
                  onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                />
                <button
                  className="text-sm text-red-500 hover:underline mt-2"
                  onClick={() => deleteColumn(column.id)}
                >
                  Delete Column
                </button>
              </CardHeader>

              {/* Column Content */}
              <CardContent>
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-2 mb-2 rounded shadow cursor-grab flex justify-between items-center ${priorities[task.priority]}`}
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                  >
                    {/* Task Details */}
                    <div>
                      <span>{task.title}</span>
                      <div className="text-xs">{task.priority}</div>
                    </div>

                    {/* Task Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        className="text-xs text-blue-300 hover:underline"
                        onClick={() => editTask(column.id, task.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteTask(column.id, task.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Task Button */}
                <button
                  className="mt-4 w-full px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => addTask(column.id)}
                >
                  Add Task
                </button>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Add Column Button */}
        <button
          className="w-80 h-16 flex items-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={addColumn}
        >
          + Add Column
        </button>
      </div>
    </div>
  );
}

export default App;
