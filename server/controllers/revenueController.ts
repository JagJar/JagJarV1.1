import { Request, Response } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { developers, revenueSettings } from "@shared/schema";
import * as revenueService from "../services/revenueDistribution";
import { z } from "zod";

/**
 * Get the earnings for the current developer
 */
export const getDeveloperEarnings = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get the developer ID for the current user
    const [developer] = await db
      .select()
      .from(developers)
      .where(eq(developers.userId, req.user.id));

    if (!developer) {
      return res.status(404).json({ error: "Developer profile not found" });
    }

    // Get the earnings
    const earnings = await revenueService.getDeveloperEarnings(developer.id);
    
    res.json(earnings);
  } catch (error) {
    console.error("Error getting developer earnings:", error);
    res.status(500).json({ error: "Failed to get earnings" });
  }
};

/**
 * Get detailed earnings by website for a specific month
 */
export const getDeveloperEarningsDetails = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const monthPattern = /^\d{4}-\d{2}$/;
  const { month } = req.params;

  if (!month || !monthPattern.test(month)) {
    return res.status(400).json({ error: "Invalid month format, must be YYYY-MM" });
  }

  try {
    // Get the developer ID for the current user
    const [developer] = await db
      .select()
      .from(developers)
      .where(eq(developers.userId, req.user.id));

    if (!developer) {
      return res.status(404).json({ error: "Developer profile not found" });
    }

    // Get the detailed earnings
    const details = await revenueService.getDeveloperEarningsDetails(developer.id, month);
    
    res.json(details);
  } catch (error) {
    console.error("Error getting earnings details:", error);
    res.status(500).json({ error: "Failed to get earnings details" });
  }
};

/**
 * Get payout history for the current developer
 */
export const getDeveloperPayouts = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get the developer ID for the current user
    const [developer] = await db
      .select()
      .from(developers)
      .where(eq(developers.userId, req.user.id));

    if (!developer) {
      return res.status(404).json({ error: "Developer profile not found" });
    }

    // Get the payout history
    const payouts = await revenueService.getDeveloperPayouts(developer.id);
    
    res.json(payouts);
  } catch (error) {
    console.error("Error getting developer payouts:", error);
    res.status(500).json({ error: "Failed to get payout history" });
  }
};

/**
 * Trigger revenue calculation for a specific month (admin only)
 */
export const calculateRevenue = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user is an admin using the isAdmin property
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const schema = z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  });

  try {
    const { month } = schema.parse(req.body);
    
    // Calculate revenue
    const result = await revenueService.calculateMonthlyRevenue(month);
    
    res.json(result);
  } catch (error) {
    console.error("Error calculating revenue:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: error.errors 
      });
    }
    
    res.status(500).json({ error: "Failed to calculate revenue" });
  }
};

/**
 * Get platform revenue settings (admin only)
 */
export const getRevenueSettings = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user is an admin (implement proper admin check in a real system)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const settings = await revenueService.getRevenueSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error getting revenue settings:", error);
    res.status(500).json({ error: "Failed to get revenue settings" });
  }
};

/**
 * Update platform revenue settings (admin only)
 */
export const updateRevenueSettings = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user is an admin (implement proper admin check in a real system)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const schema = z.object({
    platformFeePercentage: z.number().min(0).max(100).optional(),
    minimumPayoutAmount: z.number().min(0).optional(),
    payoutSchedule: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  });

  try {
    const validatedData = schema.parse(req.body);
    
    // Convert number to string for platformFeePercentage if it exists
    const newSettings: Partial<typeof revenueSettings.$inferInsert> = {
      ...(validatedData.minimumPayoutAmount !== undefined && { minimumPayoutAmount: validatedData.minimumPayoutAmount }),
      ...(validatedData.payoutSchedule !== undefined && { payoutSchedule: validatedData.payoutSchedule }),
      ...(validatedData.platformFeePercentage !== undefined && { platformFeePercentage: validatedData.platformFeePercentage.toString() }),
    };
    
    // Update settings
    const result = await revenueService.updateRevenueSettings(newSettings);
    
    res.json(result);
  } catch (error) {
    console.error("Error updating revenue settings:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: error.errors 
      });
    }
    
    res.status(500).json({ error: "Failed to update revenue settings" });
  }
};

/**
 * Get platform revenue statistics (admin only)
 */
export const getPlatformRevenueStats = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user is an admin (implement proper admin check in a real system)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  try {
    const stats = await revenueService.getPlatformRevenueStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting platform revenue stats:", error);
    res.status(500).json({ error: "Failed to get platform revenue statistics" });
  }
};

/**
 * Get top earning developers for a specific month (admin only)
 */
export const getTopEarningDevelopers = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user is an admin (implement proper admin check in a real system)
  if (req.user.id !== 1) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const { month } = req.params;
  
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: "Invalid month format, must be YYYY-MM" });
  }

  try {
    const developers = await revenueService.getTopEarningDevelopers(month);
    res.json(developers);
  } catch (error) {
    console.error("Error getting top earning developers:", error);
    res.status(500).json({ error: "Failed to get top earning developers" });
  }
};