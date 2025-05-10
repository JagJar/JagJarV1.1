import { db } from "../db";
import { 
  developers, 
  websites, 
  timeTracking, 
  users,
  revenue,
  developerEarnings,
  revenueSettings,
  revenueDistributionLogs,
  payouts,
  apiKeys
} from "@shared/schema";
import { eq, and, lt, sum, gt, gte, lte, count, desc } from "drizzle-orm";
import { format, subMonths, parse } from "date-fns";

// Type for earnings calculation result
interface EarningsResult {
  developerId: number;
  websiteId: number;
  totalTime: number;
  premiumTime: number;
  earnings: number;
}

/**
 * Calculate revenue distribution for a specific month
 * 
 * @param month - Month in YYYY-MM format (default: previous month)
 * @returns Summary of the distribution process
 */
export async function calculateMonthlyRevenue(month?: string) {
  // Default to previous month if not specified
  if (!month) {
    const previousMonth = subMonths(new Date(), 1);
    month = format(previousMonth, 'yyyy-MM');
  }

  // Parse month to get start and end dates
  const startDate = parse(`${month}-01`, 'yyyy-MM-dd', new Date());
  const nextMonth = format(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1), 'yyyy-MM');
  const endDate = parse(`${nextMonth}-01`, 'yyyy-MM-dd', new Date());
  
  // Get revenue settings
  const [settings] = await db.select().from(revenueSettings).limit(1);
  
  // Default settings if none exist
  const platformFeePercentage = settings ? Number(settings.platformFeePercentage) : 30;
  const minimumPayoutAmount = settings?.minimumPayoutAmount || 1000; // $10 in cents
  
  // 1. Calculate total premium user time for the month
  const timeResults = await db
    .select({
      totalPremiumTime: sum(timeTracking.duration).mapWith(Number)
    })
    .from(timeTracking)
    .innerJoin(users, eq(timeTracking.userId, users.id))
    .where(
      and(
        gte(timeTracking.date, startDate),
        lt(timeTracking.date, endDate),
        eq(users.isSubscribed, true)
      )
    );
  
  const totalPremiumTime = timeResults[0]?.totalPremiumTime || 0;
  
  if (totalPremiumTime === 0) {
    // No premium usage this month
    return {
      month,
      totalRevenue: 0,
      totalDistributed: 0,
      platformFee: 0,
      developerCount: 0,
      status: 'completed',
      notes: 'No premium usage recorded for this period'
    };
  }
  
  // 2. Get total subscription revenue for the month (simple estimation for now)
  // In a real system, this would come from actual payment records
  // Assume $10/month per premium user for now
  const premiumUserCount = await db
    .select({
      count: count()
    })
    .from(users)
    .where(eq(users.isSubscribed, true));
  
  const totalRevenue = premiumUserCount[0]?.count * 1000 || 0; // $10.00 in cents
  const platformFeeAmount = Math.floor(totalRevenue * (Number(platformFeePercentage) / 100));
  const distributableAmount = totalRevenue - platformFeeAmount;
  
  // 3. Calculate time spent on each developer's websites by premium users
  const websiteUsage = await db
    .select({
      developerId: developers.id,
      websiteId: websites.id,
      totalTime: sum(timeTracking.duration).mapWith(Number),
    })
    .from(timeTracking)
    .innerJoin(websites, eq(timeTracking.websiteId, websites.id))
    .innerJoin(users, eq(timeTracking.userId, users.id))
    .innerJoin(apiKeys, eq(websites.apiKeyId, apiKeys.id))
    .innerJoin(developers, eq(apiKeys.developerId, developers.id))
    .where(
      and(
        gte(timeTracking.date, startDate),
        lt(timeTracking.date, endDate),
        eq(users.isSubscribed, true)
      )
    )
    .groupBy(developers.id, websites.id);
  
  // 4. Calculate earnings for each developer based on their proportion of usage
  const earnings: EarningsResult[] = websiteUsage.map(usage => {
    const proportion = usage.totalTime / totalPremiumTime;
    const earnings = Math.floor(distributableAmount * proportion);
    
    return {
      developerId: usage.developerId,
      websiteId: usage.websiteId,
      totalTime: usage.totalTime,
      premiumTime: usage.totalTime, // All this time is from premium users
      earnings: earnings
    };
  });

  // 5. Store the earnings data
  for (const earning of earnings) {
    await db.insert(developerEarnings).values({
      developerId: earning.developerId,
      websiteId: earning.websiteId,
      month: month,
      totalTime: earning.totalTime,
      premiumTime: earning.premiumTime,
      earnings: earning.earnings,
    });
  }
  
  // 6. Aggregate earnings by developer
  const developerTotals = earnings.reduce((acc, curr) => {
    acc[curr.developerId] = (acc[curr.developerId] || 0) + curr.earnings;
    return acc;
  }, {} as Record<number, number>);
  
  // 7. Store total revenue for each developer
  for (const [developerId, amount] of Object.entries(developerTotals)) {
    await db.insert(revenue).values({
      developerId: parseInt(developerId),
      amount: amount,
      month: month,
    });
    
    // Create a payout record if amount is above minimum threshold
    if (amount >= minimumPayoutAmount) {
      await db.insert(payouts).values({
        developerId: parseInt(developerId),
        amount: amount,
        status: 'pending',
        paymentMethod: 'bank_transfer', // Default method
        notes: `Automatic payout for ${month}`,
      });
    }
  }
  
  // 8. Log the distribution
  const [distributionLog] = await db.insert(revenueDistributionLogs).values({
    month: month,
    totalRevenue: totalRevenue,
    totalDistributed: distributableAmount,
    platformFee: platformFeeAmount,
    developerCount: Object.keys(developerTotals).length,
    status: 'completed',
    notes: `Processed on ${new Date().toISOString()}`,
  }).returning();
  
  return distributionLog;
}

/**
 * Get earnings breakdown for a developer
 * 
 * @param developerId - Developer ID
 * @param limit - Number of months to retrieve
 * @returns Array of monthly earnings
 */
export async function getDeveloperEarnings(developerId: number, limit = 12) {
  return db
    .select({
      month: revenue.month,
      amount: revenue.amount,
      calculatedAt: revenue.calculatedAt,
    })
    .from(revenue)
    .where(eq(revenue.developerId, developerId))
    .orderBy(desc(revenue.month))
    .limit(limit);
}

/**
 * Get detailed earnings breakdown by website for a developer
 * 
 * @param developerId - Developer ID
 * @param month - Month in YYYY-MM format
 * @returns Detailed earnings breakdown by website
 */
export async function getDeveloperEarningsDetails(developerId: number, month: string) {
  return db
    .select({
      websiteId: developerEarnings.websiteId,
      websiteName: websites.name,
      websiteUrl: websites.url,
      totalTime: developerEarnings.totalTime,
      premiumTime: developerEarnings.premiumTime,
      earnings: developerEarnings.earnings,
    })
    .from(developerEarnings)
    .innerJoin(websites, eq(developerEarnings.websiteId, websites.id))
    .where(
      and(
        eq(developerEarnings.developerId, developerId),
        eq(developerEarnings.month, month)
      )
    )
    .orderBy(desc(developerEarnings.earnings));
}

/**
 * Get payout history for a developer
 * 
 * @param developerId - Developer ID
 * @param limit - Number of payouts to retrieve
 * @returns Array of payout records
 */
export async function getDeveloperPayouts(developerId: number, limit = 10) {
  return db
    .select()
    .from(payouts)
    .where(eq(payouts.developerId, developerId))
    .orderBy(desc(payouts.createdAt))
    .limit(limit);
}

/**
 * Get revenue stats by month for the platform
 * 
 * @param months - Number of months to retrieve
 * @returns Array of monthly revenue stats
 */
export async function getPlatformRevenueStats(months = 12) {
  return db
    .select()
    .from(revenueDistributionLogs)
    .orderBy(desc(revenueDistributionLogs.month))
    .limit(months);
}

/**
 * Get top earning developers for a specific month
 * 
 * @param month - Month in YYYY-MM format
 * @param limit - Number of developers to retrieve
 * @returns Array of top earning developers
 */
export async function getTopEarningDevelopers(month: string, limit = 10) {
  return db
    .select({
      developerId: revenue.developerId,
      developerName: developers.companyName,
      amount: revenue.amount,
    })
    .from(revenue)
    .innerJoin(developers, eq(revenue.developerId, developers.id))
    .where(eq(revenue.month, month))
    .orderBy(desc(revenue.amount))
    .limit(limit);
}

/**
 * Get platform revenue settings
 * 
 * @returns Current revenue settings
 */
export async function getRevenueSettings() {
  const [settings] = await db.select().from(revenueSettings).limit(1);
  return settings || {
    platformFeePercentage: 30.00,
    minimumPayoutAmount: 1000,
    payoutSchedule: 'monthly',
  };
}

/**
 * Update platform revenue settings
 * 
 * @param newSettings - Updated settings
 * @returns Updated settings
 */
export async function updateRevenueSettings(newSettings: Partial<typeof revenueSettings.$inferInsert>) {
  const [existingSettings] = await db.select().from(revenueSettings).limit(1);
  
  if (existingSettings) {
    const [updated] = await db
      .update(revenueSettings)
      .set({
        ...newSettings,
        updatedAt: new Date(),
      })
      .where(eq(revenueSettings.id, existingSettings.id))
      .returning();
    
    return updated;
  } else {
    const [created] = await db
      .insert(revenueSettings)
      .values({
        ...newSettings,
        updatedAt: new Date(),
      })
      .returning();
    
    return created;
  }
}