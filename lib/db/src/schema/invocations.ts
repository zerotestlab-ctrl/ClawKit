import { pgTable, text, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const platformEnum = pgEnum("platform", ["chatgpt", "claude", "grok", "moltbook"]);

export const invocationsTable = pgTable("invocations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull(),
  userId: text("user_id").notNull(),
  platform: platformEnum("platform").notNull(),
  agentName: text("agent_name").notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  revenueImpact: real("revenue_impact").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInvocationSchema = createInsertSchema(invocationsTable).omit({ id: true, createdAt: true });
export type InsertInvocation = z.infer<typeof insertInvocationSchema>;
export type Invocation = typeof invocationsTable.$inferSelect;
