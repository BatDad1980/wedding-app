import React, { useState } from 'react';
import { Plus, Check, Trash2, Tag, CheckSquare } from 'lucide-react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Checklist: React.FC<Props> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      category: 'General',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const categories = ['All', ...Array.from(new Set(tasks.map(t => t.category)))];
  const filteredTasks = activeCategory === 'All' ? tasks : tasks.filter(t => t.category === activeCategory);

  return (
    <div className="animate-slideUp pb-12">
      <h2 className="text-2xl font-bold mb-6">Wedding Checklist</h2>

      {/* Quick Add */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="I need to..."
          className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-stone-700 placeholder:text-stone-300"
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          onClick={addTask}
          className="bg-stone-800 text-white p-2 rounded-xl"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === cat
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white text-stone-500 border border-stone-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${task.completed
              ? 'bg-stone-50 border-stone-100 opacity-60'
              : 'bg-white border-stone-100 shadow-sm'
              }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 text-white' : 'border-2 border-stone-200 text-transparent'
                }`}
            >
              <Check size={14} />
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-tighter flex items-center gap-1">
                  <Tag size={10} /> {task.category}
                </span>
                <span className="text-[10px] text-stone-300">•</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-tighter">
                  Due {task.dueDate}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-stone-300 hover:text-rose-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 text-stone-300">
            {/* Using CheckSquare icon from lucide-react */}
            <CheckSquare size={48} className="mx-auto mb-4 opacity-10" />
            <p className="italic serif">No tasks found here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;