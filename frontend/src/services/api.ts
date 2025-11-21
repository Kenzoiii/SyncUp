import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired
      console.error('Authentication failed. Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  teamName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  teamId: number;
  teamName: string;
}

export interface DashboardStats {
  score: string;
  tasksCompleted: number;
  minutesOnline: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  taskCompletionRate: number;
  totalProjects: number;
}

export interface UserProfile {
  userId: number;
  email: string;
  fullName: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  newPassword?: string;
}

export interface Project {
  id: number;
  projectName: string;
  description: string;
  status: string;
  progressPercentage: number;
  teamId: number;
  isAdmin: boolean;
}

export interface ProjectMember {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface Task {
  id: number;
  taskName: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  startDate: string;
  projectId: number;
  assignedUserName?: string;
}

export interface UserSearchResult {
  userId: number;
  fullName: string;
  email: string;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/dashboard/projects');
    return response.data;
  },

  getTasks: async () => {
    const response = await api.get('/dashboard/tasks');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getMe: async (): Promise<UserProfile> => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateMe: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put('/users/me', payload);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getMyProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/my-projects');
    return response.data;
  },
  getProjectMembers: async (projectId: number): Promise<ProjectMember[]> => {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data;
  },
  addMember: async (projectId: number, email: string): Promise<any> => {
    const response = await api.post(`/projects/${projectId}/add-member`, { email });
    return response.data;
  },
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    const response = await api.get(`/projects/search-users?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getMyTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  },
  getProjectTasks: async (projectId: number): Promise<Task[]> => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },
};

export default api;
