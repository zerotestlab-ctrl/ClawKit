import { pgTable, text, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  apiSpecUrl: text("api_spec_url"),
  apiSpecContent: text("api_spec_content"),
  websiteUrl: text("website_url"),
  mcpManifest: text("mcp_manifest"),
  agentsMd: text("agents_md"),
  chatgptSubmission: text("chatgpt_submission"),
  claudeSubmission: text("claude_submission"),
  moltbookVariant: text("moltbook_variant"),
  safetyScore: integer("safety_score"),
  safetyReport: text("safety_report"),
  generated: boolean("generated").notNull().default(false),
  invocations: integer("invocations").notNull().default(0),
  revenue: real("revenue").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
