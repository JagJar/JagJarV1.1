import { db } from "./db";
import { users, developers, apiKeys, websites, timeTracking, revenue, plans } from "@shared/schema";
import { hashPassword } from "./auth";
import { generateApiKeyString } from "./utils";

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // Check if users table already has data
    const existingUsers = await db.select({ count: db.fn.count() }).from(users);
    
    if (parseInt(existingUsers[0].count as string) > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }
    
    // Create users
    const [user1] = await db.insert(users).values({
      username: "developer",
      email: "developer@example.com",
      password: await hashPassword("password"),
      isSubscribed: false,
      subscriptionType: "free"
    }).returning();
    
    const [user2] = await db.insert(users).values({
      username: "premium",
      email: "premium@example.com",
      password: await hashPassword("password"),
      isSubscribed: true,
      subscriptionType: "premium"
    }).returning();
    
    console.log("Created users");
    
    // Create developer
    const [developer1] = await db.insert(developers).values({
      userId: user1.id,
      companyName: "Example Dev Co",
      website: "https://example.com"
    }).returning();
    
    console.log("Created developer");
    
    // Create API keys
    const [apiKey1] = await db.insert(apiKeys).values({
      developerId: developer1.id,
      name: "Example Web App",
      key: generateApiKeyString(),
      active: true
    }).returning();
    
    const [apiKey2] = await db.insert(apiKeys).values({
      developerId: developer1.id,
      name: "Another App",
      key: generateApiKeyString(),
      active: true
    }).returning();
    
    console.log("Created API keys");
    
    // Create websites
    const [website1] = await db.insert(websites).values({
      apiKeyId: apiKey1.id,
      name: "Example Web App",
      url: "https://example.com"
    }).returning();
    
    const [website2] = await db.insert(websites).values({
      apiKeyId: apiKey2.id,
      name: "Another App",
      url: "https://another-example.com"
    }).returning();
    
    console.log("Created websites");
    
    // Create time tracking
    await db.insert(timeTracking).values({
      userId: user2.id,
      websiteId: website1.id,
      duration: 1800 // 30 minutes
    });
    
    await db.insert(timeTracking).values({
      userId: user2.id,
      websiteId: website2.id,
      duration: 3600 // 1 hour
    });
    
    console.log("Created time tracking");
    
    // Create revenue
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    
    await db.insert(revenue).values({
      developerId: developer1.id,
      month: currentMonth,
      amount: 125032 // $1,250.32
    });
    
    await db.insert(revenue).values({
      developerId: developer1.id,
      month: previousMonth,
      amount: 108542 // $1,085.42
    });
    
    console.log("Created revenue");
    
    // Create plans
    await db.insert(plans).values([
      {
        name: "Free",
        price: 0,
        timeLimit: 3600 * 60, // 60 hours per month
        description: "Basic access to JagJar enabled sites"
      },
      {
        name: "Premium",
        price: 999, // $9.99
        timeLimit: null, // Unlimited
        description: "Unlimited access to JagJar enabled sites"
      }
    ]);
    
    console.log("Created plans");
    
    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Export the function to be called from server startup
export { seedDatabase };