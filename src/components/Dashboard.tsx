
import React from 'react';
import { Calendar, Heart, Users, CheckCircle2, Wallet } from 'lucide-react';
import { Task, Guest, Expense } from '../types';

interface Props {
  tasks: Task[];
  guests: Guest[];
  expenses: Expense[];
  weddingDate: string;
  setWeddingDate: (date: string) => void;
  budgetGoal: number;
}

const Dashboard: React.FC<Props> = ({ tasks, guests, expenses, weddingDate, setWeddingDate, budgetGoal }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const confirmedGuests = guests.filter(g => g.status === 'Confirmed').length;
  const totalCost = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const totalPaid = expenses.reduce((acc, curr) => acc + curr.paidAmount, 0);

  const calculateDaysLeft = () => {
    const diff = new Date(weddingDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const budgetProgress = Math.min(100, Math.round((totalCost / budgetGoal) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Countdown Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Heart size={100} fill="currentColor" className="text-rose-500" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
            <Calendar size={20} />
          </div>
          <span className="font-medium text-stone-600">Wedding Countdown</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-stone-800">{calculateDaysLeft()}</span>
          <span className="text-xl text-stone-400 font-medium italic serif">days to go</span>
        </div>
        <input
          type="date"
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
          className="mt-4 text-xs bg-stone-50 border-none rounded-lg px-2 py-1 text-stone-500 focus:outline-none"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-2 text-stone-500">
            <Users size={16} />
            <span className="text-sm font-medium">Guests</span>
          </div>
          <p className="text-2xl font-bold text-stone-800">{confirmedGuests} / {guests.length}</p>
          <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">Confirmed RSVPs</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center gap-2 mb-2 text-stone-500">
            <Wallet size={16} />
            <span className="text-sm font-medium">Spent</span>
          </div>
          <p className="text-2xl font-bold text-stone-800">${totalCost.toLocaleString()}</p>
          <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">of ${budgetGoal.toLocaleString()} goal</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Planning Progress</h3>
          <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">{progress}%</span>
        </div>
        <div className="relative h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-rose-400 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
          <span>{tasks.length - completedTasks} tasks remaining</span>
          <div className="flex items-center gap-1 text-emerald-500 font-semibold">
            <CheckCircle2 size={12} />
            <span>{completedTasks} completed</span>
          </div>
        </div>
      </div>

      {/* Budget Progress Card */}
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Budget Usage</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${budgetProgress > 90 ? 'bg-rose-100 text-rose-600' : 'bg-stone-100 text-stone-600'}`}>{budgetProgress}%</span>
        </div>
        <div className="relative h-2 w-full bg-stone-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${budgetProgress > 100 ? 'bg-rose-600' : 'bg-stone-800'}`}
            style={{ width: `${Math.min(100, budgetProgress)}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-stone-400 uppercase font-bold tracking-wider">
          <span>Total Paid: ${totalPaid.toLocaleString()}</span>
          <span>Remaining: ${(budgetGoal - totalCost).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
