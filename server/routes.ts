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
      
      // Get API keys for this developer
      const apiKeys = await storage.getApiKeysByDeveloperId(developer.id);
      
      if (!apiKeys || apiKeys.length === 0) {
        // Return empty analytics if developer has no API keys
        return res.json({
          totalTime: 0,
          activeUsers: 0,
          estimatedEarnings: 0,
          timeData: []
        });
      }
      
      // Get all websites associated with this developer's API keys
      const apiKeyIds = apiKeys.map(key => key.id);
      let websites = [];
      
      for (const apiKeyId of apiKeyIds) {
        const websitesForKey = await storage.getWebsitesByApiKeyId(apiKeyId);
        websites = websites.concat(websitesForKey);
      }
      
      if (websites.length === 0) {
        // Return empty analytics if developer has no websites
        return res.json({
          totalTime: 0,
          activeUsers: 0,
          estimatedEarnings: 0,
          timeData: []
        });
      }
      
      // Get all time tracking data for the websites
      const websiteIds = websites.map(website => website.id);
      let totalTimeSeconds = 0;
      let uniqueUserIds = new Set();
      const timeDataByDate = new Map();
      
      for (const websiteId of websiteIds) {
        const timeTrackingData = await storage.getTimeTrackingByWebsiteId(websiteId);
        
        // Calculate total time
        for (const record of timeTrackingData) {
          totalTimeSeconds += record.duration;
          uniqueUserIds.add(record.userId);
          
          // Format the date for display (e.g., "Mar 26")
          const date = new Date(record.date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
          
          // Accumulate hours by date
          const hoursForRecord = Math.round(record.duration / 3600);
          if (timeDataByDate.has(formattedDate)) {
            timeDataByDate.set(formattedDate, timeDataByDate.get(formattedDate) + hoursForRecord);
          } else {
            timeDataByDate.set(formattedDate, hoursForRecord);
          }
        }
      }
      
      // Get earnings data
      const earningsData = await storage.getRevenueByDeveloperId(developer.id);
      let estimatedEarnings = 0;
      
      if (earningsData && earningsData.length > 0) {
        // Sum up all earnings
        estimatedEarnings = earningsData.reduce((total, record) => total + record.amount, 0) / 100;
      }
      
      // Convert timeDataByDate map to array for chart
      const timeData = Array.from(timeDataByDate).map(([date, hours]) => ({
        date,
        hours
      }));
      
      // Sort timeData chronologically
      timeData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      const analyticsData = {
        totalTime: totalTimeSeconds,
        activeUsers: uniqueUserIds.size,
        estimatedEarnings: estimatedEarnings,
        timeData: timeData
      };
      
      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics overview error:", error);
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
      
      // Get API keys for this developer
      const apiKeys = await storage.getApiKeysByDeveloperId(developer.id);
      
      if (!apiKeys || apiKeys.length === 0) {
        return res.json([]);
      }
      
      // Get all websites associated with this developer's API keys
      const apiKeyIds = apiKeys.map(key => key.id);
      let websites = [];
      
      for (const apiKeyId of apiKeyIds) {
        const websitesForKey = await storage.getWebsitesByApiKeyId(apiKeyId);
        websites = websites.concat(websitesForKey);
      }
      
      if (websites.length === 0) {
        return res.json([]);
      }
      
      // Get time distribution by website
      const distributionData = [];
      const websiteIds = websites.map(website => website.id);
      const websiteNameMap = new Map(websites.map(website => [website.id, website.name]));
      
      let totalTime = 0;
      
      // First, calculate total time across all websites
      for (const websiteId of websiteIds) {
        const timeTrackingData = await storage.getTimeTrackingByWebsiteId(websiteId);
        for (const record of timeTrackingData) {
          totalTime += record.duration;
        }
      }
      
      // If there's no time tracked, return empty array
      if (totalTime === 0) {
        return res.json([]);
      }
      
      // Get time for each website and calculate percentage
      for (const websiteId of websiteIds) {
        const timeTrackingData = await storage.getTimeTrackingByWebsiteId(websiteId);
        
        if (timeTrackingData.length > 0) {
          const websiteTime = timeTrackingData.reduce((sum, record) => sum + record.duration, 0);
          const percentage = Math.round((websiteTime / totalTime) * 100);
          
          if (percentage > 0) {
            distributionData.push({
              name: websiteNameMap.get(websiteId) || `Website ${websiteId}`,
              value: percentage
            });
          }
        }
      }
      
      // If we have too many websites with small percentages, combine them into "Other"
      if (distributionData.length > 5) {
        // Sort by value (highest first)
        distributionData.sort((a, b) => b.value - a.value);
        
        // Take top 4 websites
        const topSites = distributionData.slice(0, 4);
        
        // Combine the rest into "Other"
        const otherSites = distributionData.slice(4);
        const otherValue = otherSites.reduce((sum, site) => sum + site.value, 0);
        
        // Return top 4 + "Other"
        const result = [...topSites];
        if (otherValue > 0) {
          result.push({ name: 'Other', value: otherValue });
        }
        
        res.json(result);
      } else {
        res.json(distributionData);
      }
    } catch (error) {
      console.error("Time distribution error:", error);
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
