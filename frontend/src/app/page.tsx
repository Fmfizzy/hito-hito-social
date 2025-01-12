'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const task = await response.json();
      setTasks(prev => [task, ...prev]);
      setNewTask('');
    } catch (error) {
      setError('Failed to create task. Please try again.');
      console.error('Error:', error);
    }
  };

  return(
    <main className="bg-zinc-200 flex items-center flex-col pt-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">All tasks</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-gray-600">Loading tasks...</div>
      ) : (
        <ul className="mt-5 space-y-3 w-full max-w-md">
          {tasks.length === 0 ? (
            <li className="text-gray-600 text-center">No tasks available</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="text-xl bg-white p-3 rounded shadow-md">
                {task.title}
              </li>
            ))
          )}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-10 flex space-x-2">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task" 
          className="h-10 px-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          disabled={!newTask.trim()}
        >
          Add Task
        </button> 
      </form>
    </main>
  )
}