import { BarChart3, FileText, CreditCard, Award } from 'lucide-react';

export const COOLVETICA_FONT = { fontFamily: "'Coolvetica', sans-serif" };

export const MENU_ITEMS = [
  { id: 'transactions', label: 'Transactions', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'licenses', label: 'Licenses', icon: CreditCard },
  { id: 'credentials', label: 'Credentials', icon: Award },
];

export const STATUS_STYLES = {
  approved: 'bg-emerald-500/10 text-emerald-500',
  denied: 'bg-rose-500/10 text-rose-500',
  pending: 'bg-[#FFB800]/10 text-[#FFB800]'
};