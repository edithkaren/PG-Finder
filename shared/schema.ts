import { pgTable, text, serial, integer, boolean, timestamp, jsonb, index, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Replit Auth persists login sessions in this table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  role: text("role", { enum: ["owner", "seeker"] }).default("seeker").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pgs = pgTable("pgs", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  price: integer("price").notNull(),
  gender: text("gender", { enum: ["male", "female", "unisex"] }).notNull(),
  amenities: text("amenities").array().notNull(), // e.g. ["WiFi", "AC", "Food"]
  images: text("images").array().notNull(),
  contactNumber: text("contact_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  pgs: many(pgs),
}));

export const pgsRelations = relations(pgs, ({ one }) => ({
  owner: one(users, {
    fields: [pgs.ownerId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPgSchema = createInsertSchema(pgs).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Pg = typeof pgs.$inferSelect;
export type InsertPg = z.infer<typeof insertPgSchema>;

export type CreatePgRequest = InsertPg;
export type UpdatePgRequest = Partial<InsertPg>;
