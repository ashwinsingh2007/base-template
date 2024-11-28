import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit2 } from "lucide-react";

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "inprogress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addColumn = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: "New Column",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((col) => col.id !== columnId));
  };

  const renameColumn = (columnId, newTitle) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

  const addTask = (columnId) => {
    const newTask = {
      id: `task-${Date.now()}`,
      content: "New Task",
      priority: "Medium",
    };
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    );
  };

  const editTask = (columnId, taskId, newContent, newPriority) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, content: newContent, priority: newPriority }
                  : task
              ),
            }
          : col
      )
    );
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: sourceItems };
          }
          if (col.id === destination.droppableId) {
            return { ...col, tasks: destItems };
          }
          return col;
        })
      );
    } else {
      const column = columns.find((col) => col.id === source.droppableId);
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) =>
          col.id === source.droppableId ? { ...col, tasks: copiedItems } : col
        )
      );
    }
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "dark" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="flex items-center space-x-2">
          <span>Dark Mode</span>
          <Switch
            checked={darkMode}
            onCheckedChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
      <Button onClick={addColumn} className="mb-4">
        Add Column
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-w-[250px] w-full sm:w-auto"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      value={column.title}
                      onChange={(e) => renameColumn(column.id, e.target.value)}
                      className="font-bold text-lg bg-transparent border-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteColumn(column.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2"
                        >
                          <CardHeader className="flex flex-row items-center justify-between p-2">
                            <Input
                              value={task.content}
                              onChange={(e) =>
                                editTask(
                                  column.id,
                                  task.id,
                                  e.target.value,
                                  task.priority
                                )
                              }
                              className="bg-transparent border-none"
                            />
                            <div className="flex items-center space-x-2">
                              <select
                                value={task.priority}
                                onChange={(e) =>
                                  editTask(
                                    column.id,
                                    task.id,
                                    task.content,
                                    e.target.value
                                  )
                                }
                                className="text-sm"
                              >
                                {Object.keys(priorityColors).map((priority) => (
                                  <option key={priority} value={priority}>
                                    {priority}
                                  </option>
                                ))}
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(column.id, task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-2">
                            <Badge
                              className={`${
                                priorityColors[task.priority]
                              } text-white`}
                            >
                              {task.priority}
                            </Badge>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <Button
                    onClick={() => addTask(column.id)}
                    className="w-full mt-2"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default function App() {
  return <KanbanBoard />;
}