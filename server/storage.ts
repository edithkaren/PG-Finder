import { db } from "./db";
import {
  pgs,
  users,
  type User,
  type InsertUser,
  type Pg,
  type InsertPg,
  type UpdatePgRequest
} from "@shared/schema";
import { eq, ilike, and, gte, lte, asc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getPgs(filters?: {
    city?: string;
    gender?: 'male' | 'female' | 'unisex';
    priceMin?: number;
    priceMax?: number;
    search?: string;
  }): Promise<Pg[]>;
  getCities(): Promise<Array<{
    city: string;
    count: number;
    latestListingAt: Date | null;
  }>>;
  getPg(id: number): Promise<Pg | undefined>;
  createPg(pg: InsertPg): Promise<Pg>;
  updatePg(id: number, updates: UpdatePgRequest): Promise<Pg>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPgs(filters?: {
    city?: string;
    gender?: 'male' | 'female' | 'unisex';
    priceMin?: number;
    priceMax?: number;
    search?: string;
  }): Promise<Pg[]> {
    const conditions = [];
    if (filters?.city) conditions.push(ilike(pgs.city, `%${filters.city}%`));
    if (filters?.gender) conditions.push(eq(pgs.gender, filters.gender));
    if (filters?.priceMin) conditions.push(gte(pgs.price, filters.priceMin));
    if (filters?.priceMax) conditions.push(lte(pgs.price, filters.priceMax));
    if (filters?.search) {
      conditions.push(
        // Simple search on name or description or city
        ilike(pgs.name, `%${filters.search}%`)
      );
    }

    if (conditions.length === 0) return await db.select().from(pgs);
    return await db.select().from(pgs).where(and(...conditions));
  }

  async getCities() {
    return await db
      .select({
        city: pgs.city,
        count: sql<number>`count(*)::int`,
        latestListingAt: sql<Date | null>`max(${pgs.createdAt})`,
      })
      .from(pgs)
      .groupBy(pgs.city)
      .orderBy(asc(pgs.city));
  }

  async getPg(id: number): Promise<Pg | undefined> {
    const [pg] = await db.select().from(pgs).where(eq(pgs.id, id));
    return pg;
  }

  async createPg(pg: InsertPg): Promise<Pg> {
    const [newPg] = await db.insert(pgs).values(pg).returning();
    return newPg;
  }

  async updatePg(id: number, updates: UpdatePgRequest): Promise<Pg> {
    const [updated] = await db.update(pgs).set(updates).where(eq(pgs.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
