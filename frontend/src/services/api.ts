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
      const isLoginRequest = error.config && error.config.url.includes('/auth/login');

      // ONLY logout on 401 (Token Expired). IGNORE 403.
      if (error.response?.status === 401 && !isLoginRequest) {
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
export interface TeamRequest {
  teamName: string;
  description?: string;
}

export interface RegisterRequest {
  fullName: string;
  teamName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateTaskRequest {
    taskName: string;
    description: string;
    priority: string;
    dueDate: string;
    projectId: number;
    assignedUserId?: number;
}

export interface AuthResponse {
  teamMember: string;
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  teamId: number;
  teamName: string;
}

export interface Team {
  id: number;
  teamName: string;
  description: string;
  adminUserId: number; //
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
  isAdmin?: boolean;
  admin?: boolean;
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
export interface TeamMember {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  joinedAt?: string;
}

export interface CreateProjectRequest {
    projectName: string;
    description: string;
    startDate: string;
    teamId: number;
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
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn("Server logout failed, but clearing local session anyway.");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },
};

export const teamsAPI = {
  createTeam: async (data: TeamRequest) => {
    const response = await api.post('/teams/create', data);
    return response.data;
  },
  joinTeam: async (teamName: string) => {
    const response = await api.post('/teams/join', { teamName });
    return response.data;
  },
  // NEW FUNCTION
  getMyTeams: async (): Promise<Team[]> => {
    const response = await api.get('/teams/my-teams');
    return response.data;
  },

  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await api.delete(`/teams/${teamId}`);
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
  getMyProjects: async (teamId?: number): Promise<Project[]> => {
    const url = teamId ? `/projects/my-projects?teamId=${teamId}` : '/projects/my-projects';
    const response = await api.get(url);
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
  createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  deleteProject: async (projectId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },
};

// Tasks API
export const tasksAPI = {
  getMyTasks: async (teamId?: number): Promise<Task[]> => {
    const url = teamId ? `/tasks/my-tasks?teamId=${teamId}` : '/tasks/my-tasks';
    const response = await api.get(url);
    return response.data;
  },
  getProjectTasks: async (projectId: number): Promise<Task[]> => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};

export default api;
