
import React, { useState } from 'react';
import { Plus, Search, UserMinus } from 'lucide-react';
import { Guest } from '../types';

interface Props {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}

const GuestList: React.FC<Props> = ({ guests, setGuests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');

  const addGuest = () => {
    if (!newGuestName.trim()) return;
    const newGuest: Guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGuestName,
      status: 'Pending',
      plusOne: false,
      dietary: ''
    };
    setGuests([...guests, newGuest]);
    setNewGuestName('');
    setShowAddForm(false);
  };

  const updateStatus = (id: string, status: Guest['status']) => {
    setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Declined': return <UserMinus size={14} className="text-rose-400" />;

    }
  };

  return (
    <div className="animate-slideUp pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Guest List</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-stone-800 text-white rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl text-center shadow-sm border border-stone-50">
          <p className="text-stone-400 text-[10px] uppercase font-bold mb-1">Total</p>
          <p className="text-xl font-bold text-stone-800">{guests.length}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
          <p className="text-emerald-600 text-[10px] uppercase font-bold mb-1">Going</p>
          <p className="text-xl font-bold text-emerald-700">{guests.filter(g => g.status === 'Confirmed').length}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl text-center border border-amber-100">
          <p className="text-amber-600 text-[10px] uppercase font-bold mb-1">Wait</p>
          <p className="text-xl font-bold text-amber-700">{guests.filter(g => g.status === 'Pending').length}</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-5 rounded-2xl mb-8 shadow-xl border border-rose-50 animate-fadeIn">
          <p className="text-sm font-bold mb-3">Add New Guest</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="Guest Full Name"
              className="flex-1 bg-stone-50 border-none outline-none px-4 py-3 rounded-xl text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addGuest()}
            />
            <button
              onClick={addGuest}
              className="bg-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search guests..."
          className="w-full bg-white border border-stone-100 outline-none pl-11 pr-4 py-3 rounded-2xl text-sm shadow-sm"
        />
      </div>

      {/* Guest List */}
      <div className="space-y-3">
        {filteredGuests.map(guest => (
          <div key={guest.id} className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold">
              {guest.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-stone-800">{guest.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${guest.status === 'Confirmed' ? 'text-emerald-500' :
                  guest.status === 'Declined' ? 'text-rose-400' : 'text-amber-500'
                  }`}>
                  {getStatusIcon(guest.status)} {guest.status}
                </span>
                {guest.plusOne && <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 rounded-md">+1</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="text-[10px] bg-stone-50 border-none rounded-lg p-1 text-stone-500 outline-none"
                value={guest.status}
                onChange={(e) => updateStatus(guest.id, e.target.value as Guest['status'])}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Going</option>
                <option value="Declined">No</option>
              </select>
              <button onClick={() => deleteGuest(guest.id)} className="text-stone-200">
              </button>
            </div>
          </div>
        ))}
        {filteredGuests.length === 0 && (
          <div className="text-center py-10 text-stone-300 italic serif">
            Invite some wonderful people!
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestList;
