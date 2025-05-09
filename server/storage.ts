import { 
  users, type User, type InsertUser,
  developers, type Developer, type InsertDeveloper,
  apiKeys, type ApiKey, type InsertApiKey,
  websites, type Website, type InsertWebsite,
  timeTracking, type TimeTracking, type InsertTimeTracking,
  revenue, type Revenue, type InsertRevenue
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Developer operations
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  getDeveloperByUserId(userId: number): Promise<Developer | undefined>;
  
  // API Key operations
  createApiKey(apiKey: InsertApiKey & { key: string }): Promise<ApiKey>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getApiKeysByDeveloperId(developerId: number): Promise<ApiKey[]>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<void>;
  
  // Website operations
  createWebsite(website: InsertWebsite): Promise<Website>;
  getWebsitesByApiKeyId(apiKeyId: number): Promise<Website[]>;
  
  // Time Tracking operations
  createTimeTracking(timeTracking: InsertTimeTracking): Promise<TimeTracking>;
  getTimeTrackingByUserId(userId: number): Promise<TimeTracking[]>;
  getTimeTrackingByWebsiteId(websiteId: number): Promise<TimeTracking[]>;
  
  // Revenue operations
  createRevenue(revenue: InsertRevenue): Promise<Revenue>;
  getRevenueByDeveloperId(developerId: number): Promise<Revenue[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private developersMap: Map<number, Developer>;
  private apiKeysMap: Map<number, ApiKey>;
  private websitesMap: Map<number, Website>;
  private timeTrackingMap: Map<number, TimeTracking>;
  private revenueMap: Map<number, Revenue>;
  
  userIdCounter: number;
  developerIdCounter: number;
  apiKeyIdCounter: number;
  websiteIdCounter: number;
  timeTrackingIdCounter: number;
  revenueIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.usersMap = new Map();
    this.developersMap = new Map();
    this.apiKeysMap = new Map();
    this.websitesMap = new Map();
    this.timeTrackingMap = new Map();
    this.revenueMap = new Map();
    
    this.userIdCounter = 1;
    this.developerIdCounter = 1;
    this.apiKeyIdCounter = 1;
    this.websiteIdCounter = 1;
    this.timeTrackingIdCounter = 1;
    this.revenueIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isSubscribed: false,
      subscriptionType: "free",
      createdAt: now
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.usersMap.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Developer operations
  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = this.developerIdCounter++;
    const now = new Date();
    const developer: Developer = { ...insertDeveloper, id, createdAt: now };
    this.developersMap.set(id, developer);
    return developer;
  }
  
  async getDeveloperByUserId(userId: number): Promise<Developer | undefined> {
    return Array.from(this.developersMap.values()).find(
      (developer) => developer.userId === userId
    );
  }

  // API Key operations
  async createApiKey(apiKey: InsertApiKey & { key: string }): Promise<ApiKey> {
    const id = this.apiKeyIdCounter++;
    const now = new Date();
    const newApiKey: ApiKey = { 
      ...apiKey, 
      id, 
      active: true, 
      createdAt: now 
    };
    this.apiKeysMap.set(id, newApiKey);
    return newApiKey;
  }
  
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    return this.apiKeysMap.get(id);
  }
  
  async getApiKeysByDeveloperId(developerId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeysMap.values()).filter(
      (apiKey) => apiKey.developerId === developerId
    );
  }
  
  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeysMap.values()).find(
      (apiKey) => apiKey.key === key
    );
  }
  
  async deleteApiKey(id: number): Promise<void> {
    this.apiKeysMap.delete(id);
    
    // Also delete related websites
    const websitesToDelete = Array.from(this.websitesMap.values())
      .filter(website => website.apiKeyId === id)
      .map(website => website.id);
    
    websitesToDelete.forEach(websiteId => {
      this.websitesMap.delete(websiteId);
    });
  }

  // Website operations
  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const id = this.websiteIdCounter++;
    const now = new Date();
    const website: Website = { ...insertWebsite, id, createdAt: now };
    this.websitesMap.set(id, website);
    return website;
  }
  
  async getWebsitesByApiKeyId(apiKeyId: number): Promise<Website[]> {
    return Array.from(this.websitesMap.values()).filter(
      (website) => website.apiKeyId === apiKeyId
    );
  }

  // Time Tracking operations
  async createTimeTracking(insertTimeTracking: InsertTimeTracking): Promise<TimeTracking> {
    const id = this.timeTrackingIdCounter++;
    const now = new Date();
    const timeTracking: TimeTracking = { ...insertTimeTracking, id, date: now };
    this.timeTrackingMap.set(id, timeTracking);
    return timeTracking;
  }
  
  async getTimeTrackingByUserId(userId: number): Promise<TimeTracking[]> {
    return Array.from(this.timeTrackingMap.values()).filter(
      (timeTracking) => timeTracking.userId === userId
    );
  }
  
  async getTimeTrackingByWebsiteId(websiteId: number): Promise<TimeTracking[]> {
    return Array.from(this.timeTrackingMap.values()).filter(
      (timeTracking) => timeTracking.websiteId === websiteId
    );
  }

  // Revenue operations
  async createRevenue(insertRevenue: InsertRevenue): Promise<Revenue> {
    const id = this.revenueIdCounter++;
    const now = new Date();
    const revenue: Revenue = { ...insertRevenue, id, calculatedAt: now };
    this.revenueMap.set(id, revenue);
    return revenue;
  }
  
  async getRevenueByDeveloperId(developerId: number): Promise<Revenue[]> {
    return Array.from(this.revenueMap.values()).filter(
      (revenue) => revenue.developerId === developerId
    ).sort((a, b) => {
      // Sort by month (newest first)
      return b.month.localeCompare(a.month);
    });
  }
  
  // Initialize with sample data
  private async initializeSampleData() {
    // Create sample users
    const user1 = await this.createUser({
      username: "developer",
      email: "developer@example.com",
      password: "$2b$10$XLBRcKPT9L8K1v0iccUhVu9r2z5N29MSE.UNxzMxCkvqtKxsxeE/K", // password: "password"
    });
    
    const user2 = await this.createUser({
      username: "premium",
      email: "premium@example.com",
      password: "$2b$10$XLBRcKPT9L8K1v0iccUhVu9r2z5N29MSE.UNxzMxCkvqtKxsxeE/K", // password: "password"
    });
    this.updateUser(user2.id, { isSubscribed: true, subscriptionType: "premium" });
    
    // Create sample developer
    const developer1 = await this.createDeveloper({
      userId: user1.id,
      companyName: "Example Dev Co",
      website: "https://example.com"
    });
    
    // Create sample API keys
    const apiKey1 = await this.createApiKey({
      developerId: developer1.id,
      name: "Example Web App",
      key: "jag_k1_3f7d9a8b2c1e5f4d6a8b9c7e5f3d1a2b4c6e8f7d9a8b2c1e5f4d6a",
      active: true
    });
    
    const apiKey2 = await this.createApiKey({
      developerId: developer1.id,
      name: "Another App",
      key: "jag_k1_2a1b3c5d7e9f8a6b4c2d1e3f5a7b9c8e6d4f2a1b3c5d7e9f8a6b4c",
      active: true
    });
    
    // Create sample websites
    const website1 = await this.createWebsite({
      apiKeyId: apiKey1.id,
      name: "Example Web App",
      url: "https://example.com"
    });
    
    const website2 = await this.createWebsite({
      apiKeyId: apiKey2.id,
      name: "Another App",
      url: "https://another-example.com"
    });
    
    // Create sample time tracking
    await this.createTimeTracking({
      userId: user2.id,
      websiteId: website1.id,
      duration: 1800 // 30 minutes
    });
    
    await this.createTimeTracking({
      userId: user2.id,
      websiteId: website2.id,
      duration: 3600 // 1 hour
    });
    
    // Create sample revenue
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    
    await this.createRevenue({
      developerId: developer1.id,
      month: currentMonth,
      amount: 125032 // $1,250.32
    });
    
    await this.createRevenue({
      developerId: developer1.id,
      month: previousMonth,
      amount: 108542 // $1,085.42
    });
  }
}

export const storage = new MemStorage();
