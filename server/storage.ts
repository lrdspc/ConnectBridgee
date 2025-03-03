import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  tasks, type Task, type InsertTask,
  stats, type Stat, type InsertStat
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Task operations
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Stats operations
  getAllStats(): Promise<Stat[]>;
  getStat(id: number): Promise<Stat | undefined>;
  updateStat(id: number, stat: Partial<InsertStat>): Promise<Stat | undefined>;
  
  // Init demo data
  initDemoData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private stats: Map<number, Stat>;
  
  private userId: number;
  private projectId: number;
  private taskId: number;
  private statId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.stats = new Map();
    
    this.userId = 1;
    this.projectId = 1;
    this.taskId = 1;
    this.statId = 1;
    
    // Init with demo data
    this.initDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Task operations
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Stats operations
  async getAllStats(): Promise<Stat[]> {
    return Array.from(this.stats.values());
  }
  
  async getStat(id: number): Promise<Stat | undefined> {
    return this.stats.get(id);
  }
  
  async updateStat(id: number, statUpdate: Partial<InsertStat>): Promise<Stat | undefined> {
    const stat = this.stats.get(id);
    if (!stat) return undefined;
    
    const updatedStat = { ...stat, ...statUpdate };
    this.stats.set(id, updatedStat);
    return updatedStat;
  }
  
  // Initialize demo data
  async initDemoData(): Promise<void> {
    // Create demo user
    if (this.users.size === 0) {
      this.createUser({
        username: 'demo',
        password: 'password',
        name: 'Jane Doe',
        email: 'jane@example.com'
      });
    }
    
    // Create demo stats
    if (this.stats.size === 0) {
      const demoStats = [
        { name: 'Total Tasks', value: 48, change: '+12%', iconClass: 'chart-line', iconBgColor: 'bg-blue-500' },
        { name: 'Completed', value: 24, change: '+8%', iconClass: 'check-double', iconBgColor: 'bg-emerald-500' },
        { name: 'In Progress', value: 18, change: '-2%', iconClass: 'clock', iconBgColor: 'bg-amber-500' },
        { name: 'Team Members', value: 6, change: '+20%', iconClass: 'users', iconBgColor: 'bg-violet-500' }
      ];
      
      demoStats.forEach(stat => {
        const id = this.statId++;
        this.stats.set(id, { ...stat, id });
      });
    }
    
    // Create demo projects
    if (this.projects.size === 0) {
      const demoProjects = [
        { 
          name: 'Website Redesign', 
          category: 'Marketing', 
          status: 'On Track', 
          dueDate: 'Dec 15, 2023', 
          progress: 65, 
          teamMembers: 4 
        },
        { 
          name: 'Mobile App Development', 
          category: 'Development', 
          status: 'At Risk', 
          dueDate: 'Nov 30, 2023', 
          progress: 42, 
          teamMembers: 6 
        },
        { 
          name: 'Q4 Analytics Report', 
          category: 'Analytics', 
          status: 'Planning', 
          dueDate: 'Dec 31, 2023', 
          progress: 15, 
          teamMembers: 2 
        }
      ];
      
      demoProjects.forEach(project => {
        const id = this.projectId++;
        this.projects.set(id, { ...project, id });
      });
    }
    
    // Create demo tasks
    if (this.tasks.size === 0) {
      const demoTasks = [
        { 
          name: 'Create wireframes for homepage', 
          project: 'Website Redesign', 
          status: 'Completed', 
          priority: 'High', 
          dueDate: 'Oct 15, 2023' 
        },
        { 
          name: 'Implement user authentication', 
          project: 'Mobile App Development', 
          status: 'In Progress', 
          priority: 'High', 
          dueDate: 'Nov 10, 2023' 
        },
        { 
          name: 'Create data collection plan', 
          project: 'Q4 Analytics Report', 
          status: 'Not Started', 
          priority: 'Medium', 
          dueDate: 'Dec 5, 2023' 
        }
      ];
      
      demoTasks.forEach(task => {
        const id = this.taskId++;
        this.tasks.set(id, { ...task, id });
      });
    }
  }
}

export const storage = new MemStorage();
