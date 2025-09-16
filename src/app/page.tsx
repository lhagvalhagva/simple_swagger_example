'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodoTitle }),
    });
    const newTodo = await res.json();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoTitle('');
  };

  const updateTodo = async (id: string, completed?: boolean, title?: string) => {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed, title }),
    });
    const updatedTodo = await res.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
    setEditingTodoId(null);
    setEditingTodoTitle('');
  };

  const deleteTodo = async (id: string) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Шинэ todo нэмэх..."
          className="flex-grow p-2 border border-gray-300 rounded shadow-sm text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Нэмэх
        </button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded shadow-sm bg-white"
          >
            {editingTodoId === todo.id ? (
              <input
                type="text"
                value={editingTodoTitle}
                onChange={(e) => setEditingTodoTitle(e.target.value)}
                onBlur={() => updateTodo(todo.id, undefined, editingTodoTitle)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateTodo(todo.id, undefined, editingTodoTitle);
                  }
                }}
                className="flex-grow p-2 border border-gray-300 rounded shadow-sm text-black"
              />
            ) : (
              <span
                className={`flex-grow text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}
              >
                {todo.title}
              </span>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => updateTodo(todo.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <button
                onClick={() => setEditingTodoId(todo.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}