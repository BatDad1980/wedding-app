
import React, { useState, useRef } from 'react';
import {
  Plus,
  Wallet,
  TrendingUp,
  DollarSign,
  Trash2,
  Mail,
  ChevronDown,
  ChevronUp,
  Camera,
  Phone,
  User,
  Edit3,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Expense } from '../types';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  budgetGoal: number;
  setBudgetGoal: (goal: number) => void;
  weddingEmail: string;
  setWeddingEmail: (email: string) => void;
}

const Budget: React.FC<Props> = ({
  expenses,
  setExpenses,
  budgetGoal,
  setBudgetGoal,
  weddingEmail,
  setWeddingEmail
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [newItem, setNewItem] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newPaid, setNewPaid] = useState('');
  const [newCategory, setNewCategory] = useState('Venue');
  const [newStatus, setNewStatus] = useState<Expense['status']>('Due');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCost = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const totalPaid = expenses.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const remainingTotal = totalCost - totalPaid;

  const categories = ['Venue', 'Catering', 'Attire', 'Decor', 'Photos', 'Flowers', 'Jewelry', 'Music', 'Other'];
  const COLORS = ['#fb7185', '#fda4af', '#f472b6', '#c084fc', '#818cf8', '#60a5fa', '#34d399', '#facc15', '#94a3b8'];

  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.cost, 0)
  })).filter(d => d.value > 0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExpense = () => {
    if (!newItem || !newCost) return;
    const cost = parseFloat(newCost);
    const paid = parseFloat(newPaid) || 0;

    // Automatically set status based on payment if not manually picked
    let status = newStatus;
    if (paid >= cost) status = 'Paid';
    else if (paid > 0) status = 'Partially Paid';
    else status = 'Due';

    const exp: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      item: newItem,
      cost: cost,
      paidAmount: paid,
      category: newCategory,
      status: status,
      contactName: newContactName,
      contactPhone: newContactPhone,
      contactEmail: newContactEmail,
      imageUrl: newImage
    };
    setExpenses([exp, ...expenses]);
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewItem('');
    setNewCost('');
    setNewPaid('');
    setNewCategory('Venue');
    setNewStatus('Due');
    setNewContactName('');
    setNewContactPhone('');
    setNewContactEmail('');
    setNewImage(undefined);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const getStatusBadge = (status: Expense['status']) => {
    switch (status) {
      case 'Paid': return <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} /> Paid</span>;
      case 'Partially Paid': return <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase bg-amber-50 px-2 py-0.5 rounded-full"><Clock size={10} /> Partial</span>;
      default: return <span className="flex items-center gap-1 text-[9px] font-bold text-rose-400 uppercase bg-rose-50 px-2 py-0.5 rounded-full"><AlertCircle size={10} /> Due</span>;
    }
  };

  const budgetUsagePercent = Math.min(100, Math.round((totalCost / budgetGoal) * 100));

  return (
    <div className="animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Wedding Budget</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-2 rounded-xl shadow-lg transition-all ${showAddForm ? 'bg-rose-500 text-white rotate-45' : 'bg-stone-800 text-white'}`}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Main Budget Card */}
      <div className="bg-stone-800 rounded-3xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <p className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">Total Estimated Spend</p>
            <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="text-stone-400 hover:text-white transition-colors">
              <Edit3 size={14} />
            </button>
          </div>

          {isEditingGoal ? (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold">$</span>
              <input
                autoFocus
                type="number"
                value={budgetGoal}
                onChange={(e) => setBudgetGoal(Number(e.target.value))}
                onBlur={() => setIsEditingGoal(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingGoal(false)}
                className="bg-stone-700 text-white text-3xl font-bold w-full rounded-lg px-2 border-none outline-none"
              />
            </div>
          ) : (
            <p className="text-4xl font-bold mb-4">${totalCost.toLocaleString()}</p>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-stone-400 font-medium">Goal: ${budgetGoal.toLocaleString()}</span>
              <span className="text-[10px] text-stone-400 font-medium">{budgetUsagePercent}% used</span>
            </div>
            <div className="h-1.5 w-full bg-stone-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${totalCost > budgetGoal ? 'bg-rose-400' : 'bg-rose-300'}`}
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-700 flex justify-between items-center text-xs text-stone-400">
            <div>
              <p className="text-[8px] uppercase tracking-wider mb-0.5">Paid To Date</p>
              <p className="text-white font-bold">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-wider mb-0.5">Remaining Due</p>
              <p className="text-rose-300 font-bold">${remainingTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={80} />
        </div>
      </div>

      {/* Wedding Email Link Card */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 mb-6 transition-all hover:border-rose-100">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
          <Mail size={18} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Wedding Correspondence</p>
          {isEditingEmail ? (
            <input
              autoFocus
              type="email"
              value={weddingEmail}
              onChange={(e) => setWeddingEmail(e.target.value)}
              onBlur={() => setIsEditingEmail(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingEmail(false)}
              placeholder="Enter your wedding email"
              className="text-xs font-medium text-stone-800 w-full outline-none bg-stone-50 rounded px-1"
            />
          ) : (
            <div className="flex items-center gap-2 group">
              <p className="text-sm font-semibold text-stone-700 truncate">
                {weddingEmail || 'No email set yet'}
              </p>
              <button onClick={() => setIsEditingEmail(true)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-rose-400 transition-all">
                <Edit3 size={12} />
              </button>
            </div>
          )}
        </div>
        {weddingEmail && (
          <a href={`mailto:${weddingEmail}`} className="p-2 text-stone-400 hover:text-rose-500 transition-colors">
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* Add Form (Expanded) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 mb-8 animate-slideUp space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-stone-800">Add New Expense</h3>
            <button onClick={() => setShowAddForm(false)} className="text-stone-300"><ChevronDown /></button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Item / Service Name</label>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="e.g. Catering Deposit"
                  className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none outline-none focus:ring-1 ring-rose-200"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Total Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-50 pl-7 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Amount Paid</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    value={newPaid}
                    onChange={(e) => setNewPaid(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-stone-50 pl-7 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none outline-none text-stone-600 appearance-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-50">
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-2 ml-1">Contact Information (Optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 relative">
                  <User size={14} className="absolute left-3 top-3.5 text-stone-300" />
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Contact Person / Company"
                    className="w-full bg-stone-50 pl-10 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3.5 text-stone-300" />
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full bg-stone-50 pl-10 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3.5 text-stone-300" />
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-stone-50 pl-10 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 py-3 rounded-xl text-xs font-bold transition-all"
              >
                <Camera size={16} />
                {newImage ? 'Change Image' : 'Attach Photo'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              {newImage && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                  <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setNewImage(undefined)} className="absolute top-0 right-0 p-0.5 bg-black/50 text-white rounded-bl-lg">
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={addExpense}
              className="w-full bg-stone-800 text-rose-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
            >
              <CreditCard size={18} />
              <span>Save Expense</span>
            </button>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="space-y-4">
        {expenses.length > 0 ? (
          expenses.sort((a, b) => b.cost - a.cost).map(exp => (
            <div key={exp.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden transition-all">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-400">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{exp.item}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">{exp.category}</span>
                      {getStatusBadge(exp.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-stone-800">${exp.cost.toLocaleString()}</p>
                    <p className="text-[9px] text-stone-400 font-medium">Paid: ${exp.paidAmount.toLocaleString()}</p>
                  </div>
                  {expandedId === exp.id ? <ChevronUp size={16} className="text-stone-300" /> : <ChevronDown size={16} className="text-stone-300" />}
                </div>
              </div>

              {expandedId === exp.id && (
                <div className="px-4 pb-4 border-t border-stone-50 pt-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-stone-300 mb-1">Status Details</p>
                        <div className="w-full bg-stone-50 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full"
                            style={{ width: `${Math.min(100, (exp.paidAmount / exp.cost) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {exp.cost - exp.paidAmount > 0
                            ? `$${(exp.cost - exp.paidAmount).toLocaleString()} remaining`
                            : 'Fully paid'}
                        </p>
                      </div>

                      {exp.contactName && (
                        <div>
                          <p className="text-[9px] uppercase font-bold text-stone-300 mb-1">Contact</p>
                          <p className="text-xs font-bold text-stone-700">{exp.contactName}</p>
                          <div className="flex flex-col gap-1 mt-1">
                            {exp.contactPhone && (
                              <a href={`tel:${exp.contactPhone}`} className="text-[10px] text-rose-400 flex items-center gap-1">
                                <Phone size={10} /> {exp.contactPhone}
                              </a>
                            )}
                            {exp.contactEmail && (
                              <a href={`mailto:${exp.contactEmail}`} className="text-[10px] text-rose-400 flex items-center gap-1">
                                <Mail size={10} /> {exp.contactEmail}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {exp.imageUrl ? (
                        <div className="relative group">
                          <img src={exp.imageUrl} alt={exp.item} className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <p className="text-[10px] text-white font-bold bg-black/40 px-2 py-1 rounded-full">View Attachment</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-square border-2 border-dashed border-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-300">
                          <Camera size={20} className="mb-1 opacity-50" />
                          <p className="text-[8px] font-bold uppercase">No Photo</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-auto">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-2 text-stone-200 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200 text-stone-300">
            <Wallet size={48} className="mx-auto mb-4 opacity-10" />
            <p className="italic serif">No expenses tracked yet.</p>
            <button onClick={() => setShowAddForm(true)} className="mt-4 text-xs font-bold text-rose-400 underline uppercase tracking-widest">Add your first item</button>
          </div>
        )}
      </div>

      {/* Category Breakdown Viz */}
      {categoryData.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <h4 className="text-[10px] uppercase font-bold text-stone-400 mb-4 flex items-center gap-2">
            <TrendingUp size={14} /> Category Allocation
          </h4>
          <div className="flex items-center">
            <div className="w-1/2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-4 space-y-1">
              {categoryData.slice(0, 5).map((d, i) => (
                <div key={d.name} className="flex justify-between items-center text-[10px]">
                  <span className="flex items-center gap-1 truncate pr-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <span className="font-bold text-stone-600">${d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
