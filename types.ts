
export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  nickname: string;
  photo?: string;
}

export interface ServiceLog {
  id: string;
  motorcycleId: string;
  date: string;
  mileage: number;
  serviceType: string;
  partsUsed: string;
  partsCost: number;
  laborCost: number;
  notes: string;
}

export interface Reminder {
  id: string;
  motorcycleId: string;
  description: string;
  dueInfo: string; // e.g., "en 3,000 km" o "en 6 meses"
}

export interface TechData {
  id: string;
  motorcycleId: string;
  dataType: string;
  value: string;
}

export type View = 'garage' | 'services' | 'reminders' | 'tech';
