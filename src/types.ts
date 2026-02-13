
export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
}

export interface Guest {
  id: string;
  name: string;
  status: 'Invited' | 'Confirmed' | 'Declined' | 'Pending';
  plusOne: boolean;
  dietary: string;
}

export interface Expense {
  id: string;
  category: string;
  item: string;
  cost: number;
  paidAmount: number;
  status: 'Paid' | 'Partially Paid' | 'Due';
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  imageUrl?: string;
}

export interface FinancialGift {
  id: string;
  giverName: string;
  amount: number;
  date: string;
  type: 'Cash' | 'Cheque' | 'Online' | 'Donation';
  notes?: string;
}

export interface WeddingGift {
  id: string;
  giverName: string;
  itemName: string;
  date: string;
  thanked: boolean;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MoodImage {
  id: string;
  url: string;
  prompt: string;
}

export type View = 'dashboard' | 'checklist' | 'budget' | 'guests' | 'ai' | 'mood' | 'gifts';
// Replace 'YOUR_KEY_HERE' with your actual Gemini API key string
export const API_KEY = "GEMINI_API_KEY";
