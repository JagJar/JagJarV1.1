import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isSubscribed: boolean("is_subscribed").default(false).notNull(),
  subscriptionType: text("subscription_type").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Developer model
export const developers = pgTable("developers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDeveloperSchema = createInsertSchema(developers).pick({
  userId: true,
  companyName: true,
  website: true,
});

// API Keys model
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").notNull().references(() => developers.id),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  developerId: true,
  name: true,
});

// Websites model
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  apiKeyId: integer("api_key_id").notNull().references(() => apiKeys.id),
  url: text("url").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebsiteSchema = createInsertSchema(websites).pick({
  apiKeyId: true,
  url: true,
  name: true,
});

// Time Tracking model
export const timeTracking = pgTable("time_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  websiteId: integer("website_id").notNull().references(() => websites.id),
  duration: integer("duration").notNull(), // duration in seconds
  date: timestamp("date").defaultNow().notNull(),
});

export const insertTimeTrackingSchema = createInsertSchema(timeTracking).pick({
  userId: true,
  websiteId: true,
  duration: true,
});

// Revenue model
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").notNull().references(() => developers.id),
  amount: integer("amount").notNull(), // amount in cents
  month: text("month").notNull(), // format: YYYY-MM
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

export const insertRevenueSchema = createInsertSchema(revenue).pick({
  developerId: true,
  amount: true,
  month: true,
});

// Subscription plans
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // price in cents
  timeLimit: integer("time_limit"), // time limit in seconds, null for unlimited
  description: text("description").notNull(),
});

export const insertPlanSchema = createInsertSchema(plans).pick({
  name: true,
  price: true,
  timeLimit: true,
  description: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Developer = typeof developers.$inferSelect;
export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;

export type TimeTracking = typeof timeTracking.$inferSelect;
export type InsertTimeTracking = z.infer<typeof insertTimeTrackingSchema>;

export type Revenue = typeof revenue.$inferSelect;
export type InsertRevenue = z.infer<typeof insertRevenueSchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
