import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { createApiKey, generateApiKeyString } from "./utils";
import { z } from "zod";
import { 
  insertApiKeySchema, 
  insertWebsiteSchema, 
  insertTimeTrackingSchema 
} from "@shared/schema";
import * as revenueController from "./controllers/revenueController";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // API Keys
  app.get("/api/keys", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      // Get the developer record for this user
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        // If user doesn't have a developer record yet, create one
        const newDeveloper = await storage.createDeveloper({
          userId: userId!,
          companyName: "",
          website: ""
        });
        
        // Return empty array since new developer doesn't have keys yet
        return res.json([]);
      }
      
      // Get API keys for this developer
      const apiKeys = await storage.getApiKeysByDeveloperId(developer.id);
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve API keys" });
    }
  });

  app.post("/api/keys", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Validate request body
      console.log("API key request body:", req.body);
      // Only validate the name field from the insert schema
      const validatedData = { name: req.body.name };
      
      // Get or create developer record
      let developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        developer = await storage.createDeveloper({
          userId: userId!,
          companyName: req.body.companyName || "",
          website: req.body.website || ""
        });
      }
      
      // Generate a unique API key
      const apiKeyString = generateApiKeyString();
      
      // Create API key
      const apiKey = await storage.createApiKey({
        developerId: developer.id,
        name: validatedData.name,
        key: apiKeyString
      });
      
      // Only create a website record if there's a valid URL
      if (req.body.website && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
        try {
          // Ensure the URL is valid
          const validUrl = req.body.website.startsWith('http://') || req.body.website.startsWith('https://') 
            ? req.body.website 
            : `https://${req.body.website}`;
          
          console.log("Creating website with URL:", validUrl);
          await storage.createWebsite({
            apiKeyId: apiKey.id,
            url: validUrl,
            name: validatedData.name
          });
          console.log("Website created successfully");
        } catch (error) {
          console.error("Error creating website record:", error);
          // Continue without throwing an error - we already have the API key
        }
      }
      
      res.status(201).json(apiKey);
    } catch (error) {
      console.error("API Key creation error:", error);
      res.status(400).json({ 
        message: "Failed to create API key", 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });

  app.delete("/api/keys/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      const keyId = parseInt(req.params.id);
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Get the API key
      const apiKey = await storage.getApiKey(keyId);
      
      // Check if API key exists and belongs to this developer
      if (!apiKey || apiKey.developerId !== developer.id) {
        return res.status(404).json({ message: "API key not found" });
      }
      
      // Delete the API key
      await storage.deleteApiKey(keyId);
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete API key" });
    }
  });

  // Time tracking
  app.post("/api/tracking", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Validate request body
      const validatedData = insertTimeTrackingSchema.parse({
        ...req.body,
        userId: userId
      });
      
      // Create time tracking record
      const timeTracking = await storage.createTimeTracking(validatedData);
      
      res.status(201).json(timeTracking);
    } catch (error) {
      res.status(400).json({ message: "Failed to create time tracking record", error: String(error) });
    }
  });

  // Analytics
  app.get("/api/analytics/overview", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Mock analytics data 
      // In a real implementation, this would retrieve actual analytics data
      const analyticsData = {
        totalTime: 2450,
        activeUsers: 1285,
        estimatedEarnings: 1245.32,
        timeData: [
          { date: 'Jan 01', hours: 142 },
          { date: 'Jan 08', hours: 189 },
          { date: 'Jan 15', hours: 231 },
          { date: 'Jan 22', hours: 256 },
          { date: 'Jan 29', hours: 312 },
          { date: 'Feb 05', hours: 275 },
          { date: 'Feb 12', hours: 298 },
          { date: 'Feb 19', hours: 344 },
          { date: 'Feb 26', hours: 385 },
          { date: 'Mar 05', hours: 421 },
          { date: 'Mar 12', hours: 465 },
          { date: 'Mar 19', hours: 498 },
          { date: 'Mar 26', hours: 510 }
        ]
      };
      
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve analytics overview" });
    }
  });

  app.get("/api/analytics/time-distribution", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Mock time distribution data
      const distributionData = [
        { name: 'Dashboard', value: 45 },
        { name: 'Analytics', value: 25 },
        { name: 'User Profile', value: 15 },
        { name: 'Settings', value: 10 },
        { name: 'Other', value: 5 }
      ];
      
      res.json(distributionData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve time distribution data" });
    }
  });

  app.get("/api/analytics/user-growth", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Mock user growth data
      const growthData = [
        { month: 'Jan', new: 65, returning: 90 },
        { month: 'Feb', new: 78, returning: 112 },
        { month: 'Mar', new: 95, returning: 135 },
        { month: 'Apr', new: 87, returning: 164 },
        { month: 'May', new: 105, returning: 192 },
        { month: 'Jun', new: 120, returning: 223 },
        { month: 'Jul', new: 134, returning: 246 },
        { month: 'Aug', new: 112, returning: 289 },
        { month: 'Sep', new: 98, returning: 310 },
        { month: 'Oct', new: 127, returning: 325 },
        { month: 'Nov', new: 145, returning: 346 },
        { month: 'Dec', new: 123, returning: 367 }
      ];
      
      res.json(growthData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user growth data" });
    }
  });

  app.get("/api/analytics/recent-activity", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Mock recent activity data
      const recentActivities = [
        {
          id: 1,
          user: { name: "John Doe", avatar: "JD", isPremium: true },
          timeSpent: "32 minutes",
          page: "/dashboard",
          date: "Today, 10:45 AM"
        },
        {
          id: 2,
          user: { name: "Alice Smith", avatar: "AS", isPremium: false },
          timeSpent: "18 minutes",
          page: "/features",
          date: "Today, 9:12 AM"
        },
        {
          id: 3,
          user: { name: "Robert Johnson", avatar: "RJ", isPremium: true },
          timeSpent: "45 minutes",
          page: "/analytics",
          date: "Yesterday, 4:30 PM"
        },
        {
          id: 4,
          user: { name: "Emily Davis", avatar: "ED", isPremium: true },
          timeSpent: "27 minutes",
          page: "/settings",
          date: "Yesterday, 2:15 PM"
        },
        {
          id: 5,
          user: { name: "Michael Brown", avatar: "MB", isPremium: false },
          timeSpent: "12 minutes",
          page: "/profile",
          date: "Yesterday, 10:20 AM"
        }
      ];
      
      res.json(recentActivities);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve recent activity data" });
    }
  });

  // Earnings
  app.get("/api/earnings", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user?.id;
      
      // Get developer record
      const developer = await storage.getDeveloperByUserId(userId!);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      
      // Get revenue records for this developer
      const earnings = await storage.getRevenueByDeveloperId(developer.id);
      
      res.json(earnings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve earnings data" });
    }
  });

  // Developer Revenue Distribution API Routes
  // Get earnings overview
  app.get("/api/revenue/earnings", revenueController.getDeveloperEarnings);
  
  // Get detailed earnings by website for a specific month
  app.get("/api/revenue/earnings/:month", revenueController.getDeveloperEarningsDetails);
  
  // Get payout history
  app.get("/api/revenue/payouts", revenueController.getDeveloperPayouts);
  
  // Admin routes
  app.post("/api/admin/revenue/calculate", revenueController.calculateRevenue);
  app.get("/api/admin/revenue/settings", revenueController.getRevenueSettings);
  app.put("/api/admin/revenue/settings", revenueController.updateRevenueSettings);
  app.get("/api/admin/revenue/stats", revenueController.getPlatformRevenueStats);
  app.get("/api/admin/revenue/top-developers/:month", revenueController.getTopEarningDevelopers);

  const httpServer = createServer(app);
  return httpServer;
}
