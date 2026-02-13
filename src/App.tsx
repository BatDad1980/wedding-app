import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Sparkles,
  Palette,
  Gift
} from 'lucide-react';

// Notice I removed the ".ts" and ".tsx" from these lines below
import { View, Task, Guest, Expense, MoodImage, FinancialGift, WeddingGift } from './types';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Budget from './components/Budget';
import GuestList from './components/GuestList';
import AIPlanner from './components/AIPlanner';
import Moodboard from './components/Moodboard';
import GiftTracker from './components/GiftTracker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [moodboard, setMoodboard] = useState<MoodImage[]>([]);
  const [financialGifts, setFinancialGifts] = useState<FinancialGift[]>([]);
  const [weddingGifts, setWeddingGifts] = useState<WeddingGift[]>([]);
  const [weddingDate, setWeddingDate] = useState<string>("2025-06-20");
  const [budgetGoal, setBudgetGoal] = useState<number>(30000);
  const [weddingEmail, setWeddingEmail] = useState<string>("");

  // Load data from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem('wedding_tasks');
    const savedGuests = localStorage.getItem('wedding_guests');
    const savedExpenses = localStorage.getItem('wedding_expenses');
    const savedMood = localStorage.getItem('wedding_mood');
    const savedDate = localStorage.getItem('wedding_date');
    const savedGoal = localStorage.getItem('wedding_budget_goal');
    const savedEmail = localStorage.getItem('wedding_email');
    const savedFinGifts = localStorage.getItem('wedding_fin_gifts');
    const savedWedGifts = localStorage.getItem('wedding_wed_gifts');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGuests) setGuests(JSON.parse(savedGuests));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedMood) setMoodboard(JSON.parse(savedMood));
    if (savedDate) setWeddingDate(savedDate);
    if (savedGoal) setBudgetGoal(Number(savedGoal));
    if (savedEmail) setWeddingEmail(savedEmail);
    if (savedFinGifts) setFinancialGifts(JSON.parse(savedFinGifts));
    if (savedWedGifts) setWeddingGifts(JSON.parse(savedWedGifts));

    // Initial data if empty
    if (!savedTasks) {
      const initialTasks = [
        { id: '1', title: 'Pick a venue', category: 'Venue', dueDate: '2024-12-01', completed: true },
        { id: '2', title: 'Find a dress', category: 'Attire', dueDate: '2025-01-15', completed: false },
        { id: '3', title: 'Send Save the Dates', category: 'Stationery', dueDate: '2024-11-20', completed: false },
      ];
      setTasks(initialTasks);
      localStorage.setItem('wedding_tasks', JSON.stringify(initialTasks));
    }
  }, []);

  // Sync back to local storage
  useEffect(() => localStorage.setItem('wedding_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('wedding_guests', JSON.stringify(guests)), [guests]);
  useEffect(() => localStorage.setItem('wedding_expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem('wedding_mood', JSON.stringify(moodboard)), [moodboard]);
  useEffect(() => localStorage.setItem('wedding_budget_goal', budgetGoal.toString()), [budgetGoal]);
  useEffect(() => localStorage.setItem('wedding_email', weddingEmail), [weddingEmail]);
  useEffect(() => localStorage.setItem('wedding_fin_gifts', JSON.stringify(financialGifts)), [financialGifts]);
  useEffect(() => localStorage.setItem('wedding_wed_gifts', JSON.stringify(weddingGifts)), [weddingGifts]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} guests={guests} expenses={expenses} weddingDate={weddingDate} setWeddingDate={setWeddingDate} budgetGoal={budgetGoal} />;
      case 'checklist': return <Checklist tasks={tasks} setTasks={setTasks} />;
      case 'budget': return (
        <Budget
          expenses={expenses}
          setExpenses={setExpenses}
          budgetGoal={budgetGoal}
          setBudgetGoal={setBudgetGoal}
          weddingEmail={weddingEmail}
          setWeddingEmail={setWeddingEmail}
        />
      );
      case 'guests': return <GuestList guests={guests} setGuests={setGuests} />;
      case 'ai': return <AIPlanner />;
      case 'mood': return <Moodboard images={moodboard} setImages={setMoodboard} />;
      case 'gifts': return (
        <GiftTracker
          financialGifts={financialGifts}
          setFinancialGifts={setFinancialGifts}
          weddingGifts={weddingGifts}
          setWeddingGifts={setWeddingGifts}
        />
      );
      default: return <Dashboard tasks={tasks} guests={guests} expenses={expenses} weddingDate={weddingDate} setWeddingDate={setWeddingDate} budgetGoal={budgetGoal} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'checklist', icon: CheckSquare, label: 'Tasks' },
    { id: 'budget', icon: Wallet, label: 'Budget' },
    { id: 'gifts', icon: Gift, label: 'Gifts' },
    { id: 'ai', icon: Sparkles, label: 'Ask AI' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#faf9f6] text-[#2d2a26] relative shadow-2xl">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1">Our Journey Begins</p>
          <h1 className="text-3xl font-bold tracking-tight">Marianne</h1>
        </div>
        <div
          onClick={() => setCurrentView('mood')}
          className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 cursor-pointer hover:scale-105 transition-transform"
        >
          <Palette size={20} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-24 overflow-y-auto no-scrollbar">
        {renderView()}
      </main>

      {/* Bottom Tab Navigation - iOS Style */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-rose-100 flex justify-around items-center py-3 pb-6 px-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === item.id ? 'text-rose-500 scale-110' : 'text-stone-400'
              }`}
          >
            <item.icon size={22} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
