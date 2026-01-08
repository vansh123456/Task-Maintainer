// User types
export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  results?: number;
}

export interface ApiError {
  status?: string;
  message: string;
  error?: any;
}

