import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertPgSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (if the file exists, it will be handled by Replit Auth integration)
  // We'll wrap it in try-catch or just call it if we know it's there. 
  // For now, let's assume standard Replit Auth setup adds `setupAuth(app)`.
  // If `setupAuth` is not found, we'll skip.
  try {
    const { setupAuth } = await import("./replit_integrations/auth");
    await setupAuth(app);
  } catch (e) {
    console.log("Auth not setup yet or failed to import", e);
  }

  app.get(api.cities.list.path, async (_req, res) => {
    const cities = await storage.getCities();
    res.json(cities);
  });

  app.get(api.pgs.list.path, async (req, res) => {
    try {
      // Parse query params using the schema
      // We need to cast req.query to unknown then to the expected type for safety or let zod handle it
      // Since req.query values are strings, we might need coercion which we added in route definition
      const filters = api.pgs.list.input?.parse(req.query);
      const pgs = await storage.getPgs(filters);
      res.json(pgs);
    } catch (err) {
       // If validation fails on query params (e.g. invalid number), return 400
       if (err instanceof z.ZodError) {
         return res.status(400).json({ message: "Invalid query parameters" });
       }
       throw err;
    }
  });

  app.get(api.pgs.get.path, async (req, res) => {
    const pg = await storage.getPg(Number(req.params.id));
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }
    res.json(pg);
  });

  app.post(api.pgs.create.path, async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
       return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const input = insertPgSchema.parse({
        ...req.body,
         ownerId: (req.user as any).id // Ensure ownerId comes from the session
      });
      const pg = await storage.createPg(input);
      res.status(201).json(pg);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.pgs.update.path, async (req, res) => {
     if (!req.isAuthenticated()) {
       return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const existing = await storage.getPg(Number(req.params.id));
      if (!existing) return res.status(404).json({ message: "PG not found" });
      
       if (existing.ownerId !== (req.user as any).id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const input = api.pgs.update.input.parse(req.body);
      const pg = await storage.updatePg(Number(req.params.id), input);
      res.json(pg);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

// Seed function to populate data
async function seedDatabase() {
  const existing = await storage.getPgs();
  if (existing.length === 0) {
    // Create a dummy user first
    const owner = await storage.createUser({
       username: "demo_owner",
       email: "owner@example.com",
       role: "owner"
    });

    await storage.createPg({
      ownerId: owner.id,
      name: "Sunny Side PG",
      description: "A bright and airy PG near the tech park. Includes breakfast and dinner.",
      address: "123 Tech Park Road",
      city: "Bangalore",
      price: 15000,
      gender: "male",
      amenities: ["WiFi", "AC", "Food", "Laundry"],
      images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000"],
      contactNumber: "9876543210"
    });
    
    await storage.createPg({
      ownerId: owner.id,
      name: "Green View Residency",
      description: "Peaceful environment, park facing, secure and safe.",
      address: "45 Green Avenue",
      city: "Pune",
      price: 12000,
      gender: "female",
      amenities: ["WiFi", "Security", "Geyser", "Power Backup"],
      images: ["https://images.unsplash.com/photo-1522771753033-6a586857f291?auto=format&fit=crop&q=80&w=1000"],
      contactNumber: "9123456789"
    });
    
    await storage.createPg({
       ownerId: owner.id,
       name: "Urban Living Co-living",
       description: "Modern co-living space for professionals. Gym and gaming zone included.",
       address: "789 Startup Hub",
       city: "Hyderabad",
       price: 18000,
       gender: "unisex",
       amenities: ["WiFi", "AC", "Gym", "Housekeeping", "Gaming Zone"],
       images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000"],
       contactNumber: "8888888888"
    });
  }
}

// Call seed in background
seedDatabase().catch(err => console.error("Seeding failed:", err));
