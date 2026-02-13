import React, { useState, useRef } from 'react';
import {
  Plus, Search, HeartHandshake,
  Camera, Gift, Coins, CheckCircle2, Circle, Trash2, Calendar, CreditCard, User
} from 'lucide-react';
import { FinancialGift, WeddingGift } from '../types';

interface Props {
  financialGifts: FinancialGift[];
  setFinancialGifts: React.Dispatch<React.SetStateAction<FinancialGift[]>>;
  weddingGifts: WeddingGift[];
  setWeddingGifts: React.Dispatch<React.SetStateAction<WeddingGift[]>>;
}

const GiftTracker: React.FC<Props> = ({
  financialGifts,
  setFinancialGifts,
  weddingGifts,
  setWeddingGifts
}) => {
  const [tab, setTab] = useState<'financial' | 'physical'>('financial');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [giverName, setGiverName] = useState('');
  const [amount, setAmount] = useState('');
  const [itemName, setItemName] = useState('');
  const [giftType, setGiftType] = useState<FinancialGift['type']>('Cash');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalFinancial = financialGifts.reduce((acc, curr) => acc + curr.amount, 0);
  const thankedCount = weddingGifts.filter(g => g.thanked).length;
  const thankYouProgress = weddingGifts.length > 0 ? Math.round((thankedCount / weddingGifts.length) * 100) : 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addGift = () => {
    if (!giverName) return;

    if (tab === 'financial') {
      const newFinGift: FinancialGift = {
        id: Math.random().toString(36).substr(2, 9),
        giverName,
        amount: parseFloat(amount) || 0,
        date: new Date().toISOString().split('T')[0],
        type: giftType,
        notes
      };
      setFinancialGifts([newFinGift, ...financialGifts]);
    } else {
      const newWedGift: WeddingGift = {
        id: Math.random().toString(36).substr(2, 9),
        giverName,
        itemName,
        date: new Date().toISOString().split('T')[0],
        thanked: false,
        imageUrl: image
      };
      setWeddingGifts([newWedGift, ...weddingGifts]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setGiverName('');
    setAmount('');
    setItemName('');
    setGiftType('Cash');
    setNotes('');
    setImage(undefined);
  };

  const toggleThanked = (id: string) => {
    setWeddingGifts(weddingGifts.map(g => g.id === id ? { ...g, thanked: !g.thanked } : g));
  };

  const deleteGift = (id: string, type: 'fin' | 'wed') => {
    if (type === 'fin') setFinancialGifts(financialGifts.filter(g => g.id !== id));
    else setWeddingGifts(weddingGifts.filter(g => g.id !== id));
  };

  const filteredFinancial = financialGifts.filter(g => g.giverName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPhysical = weddingGifts.filter(g => g.giverName.toLowerCase().includes(searchTerm.toLowerCase()) || g.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gifts & Gratitude</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-2 rounded-xl shadow-lg transition-all ${showAddForm ? 'bg-rose-500 text-white rotate-45' : 'bg-stone-800 text-white'}`}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setTab('financial')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === 'financial' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}
        >
          <Coins size={14} /> Financial
        </button>
        <button
          onClick={() => setTab('physical')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === 'physical' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}
        >
          <Gift size={14} /> Physical
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 mb-6">
        {tab === 'financial' ? (
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Total Contributions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-stone-800">${totalFinancial.toLocaleString()}</span>
              <span className="text-xs text-emerald-500 font-bold serif italic">received</span>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="flex-1 bg-stone-50 rounded-2xl p-3">
                <p className="text-[8px] uppercase text-stone-400 font-bold">Donations</p>
                <p className="text-sm font-bold text-stone-700">${financialGifts.filter(g => g.type === 'Donation').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
              <div className="flex-1 bg-stone-50 rounded-2xl p-3">
                <p className="text-[8px] uppercase text-stone-400 font-bold">Cash/Online</p>
                <p className="text-sm font-bold text-stone-700">${financialGifts.filter(g => g.type !== 'Donation').reduce((a, c) => a + c.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Thank You Card Status</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-stone-800">{thankedCount} / {weddingGifts.length}</span>
              <span className="text-xs text-rose-400 font-bold serif italic">sent</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 transition-all duration-1000"
                style={{ width: `${thankYouProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-2 font-medium">{weddingGifts.length - thankedCount} cards remaining to be sent</p>
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-100 mb-8 animate-slideUp space-y-4">
          <h3 className="font-bold text-stone-800">Add {tab === 'financial' ? 'Financial Gift' : 'Wedding Gift'}</h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Giver's Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="text"
                  value={giverName}
                  onChange={(e) => setGiverName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-stone-50 pl-10 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                />
              </div>
            </div>

            {tab === 'financial' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-stone-50 pl-7 pr-4 py-3 rounded-xl text-sm border-none outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Type</label>
                    <select
                      value={giftType}
                      onChange={(e) => setGiftType(e.target.value as any)}
                      className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none outline-none appearance-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Online">Online</option>
                      <option value="Donation">Donation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Message or specific fund..."
                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none outline-none h-20 resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 ml-1">Gift Item</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. KitchenAid Mixer"
                    className="w-full bg-stone-50 px-4 py-3 rounded-xl text-sm border-none outline-none"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-600 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    <Camera size={16} />
                    {image ? 'Change Photo' : 'Add Gift Photo'}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  {image && <img src={image} className="w-12 h-12 rounded-lg object-cover" />}
                </div>
              </>
            )}

            <button
              onClick={addGift}
              className="w-full bg-stone-800 text-rose-200 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all mt-2"
            >
              Record Gift
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${tab === 'financial' ? 'donors' : 'gifts'}...`}
          className="w-full bg-white border border-stone-100 outline-none pl-11 pr-4 py-3 rounded-2xl text-sm shadow-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {tab === 'financial' ? (
          filteredFinancial.length > 0 ? (
            filteredFinancial.map(gift => (
              <div key={gift.id} className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${gift.type === 'Donation' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-400'}`}>
                    {gift.type === 'Donation' ? <HeartHandshake size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{gift.giverName}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">
                      {gift.type} • {gift.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-stone-800">${gift.amount.toLocaleString()}</span>
                  <button onClick={() => deleteGift(gift.id, 'fin')} className="text-stone-200 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={<Coins size={48} />} text="No financial gifts recorded yet." />
          )
        ) : (
          filteredPhysical.length > 0 ? (
            filteredPhysical.map(gift => (
              <div key={gift.id} className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-50 overflow-hidden flex items-center justify-center border border-stone-100">
                      {gift.imageUrl ? <img src={gift.imageUrl} className="w-full h-full object-cover" /> : <Gift size={20} className="text-stone-300" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{gift.itemName}</p>
                      <p className="text-xs text-stone-400">from {gift.giverName}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteGift(gift.id, 'wed')} className="text-stone-200 hover:text-rose-400">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-50">
                  <span className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1">
                    <Calendar size={12} /> {gift.date}
                  </span>
                  <button
                    onClick={() => toggleThanked(gift.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${gift.thanked ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}
                  >
                    {gift.thanked ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    {gift.thanked ? 'Thanked' : 'Send Thanks'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={<Gift size={48} />} text="No wedding gifts recorded yet." />
          )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200 text-stone-300">
    <div className="mx-auto mb-4 opacity-10">{icon}</div>
    <p className="italic serif">{text}</p>
  </div>
);

export default GiftTracker;