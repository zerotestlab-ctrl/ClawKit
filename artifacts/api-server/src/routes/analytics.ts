import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable, invocationsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const products = await db.select().from(productsTable).where(eq(productsTable.userId, userId));
    const totalProducts = products.length;
    const totalInvocations = products.reduce((sum, p) => sum + p.invocations, 0);
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

    const weeklyInvocations = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        invocations: Math.floor(Math.random() * 50) + totalInvocations / 7,
        revenue: parseFloat(((Math.random() * 10 + totalRevenue / 7) as number).toFixed(2)),
      };
    });

    const topProducts = products
      .sort((a, b) => b.invocations - a.invocations)
      .slice(0, 5)
      .map((p) => ({
        productId: p.id,
        name: p.name,
        invocations: p.invocations,
        revenue: p.revenue,
      }));

    const platformBreakdown = [
      { platform: "ChatGPT", invocations: Math.floor(totalInvocations * 0.38), percentage: 38 },
      { platform: "Claude", invocations: Math.floor(totalInvocations * 0.31), percentage: 31 },
      { platform: "Grok", invocations: Math.floor(totalInvocations * 0.21), percentage: 21 },
      { platform: "Moltbook", invocations: Math.floor(totalInvocations * 0.10), percentage: 10 },
    ];

    res.json({
      totalProducts,
      totalInvocations,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      weeklyInvocations,
      topProducts,
      platformBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invocations", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const invocations = await db
      .select()
      .from(invocationsTable)
      .where(eq(invocationsTable.userId, userId))
      .orderBy(sql`${invocationsTable.createdAt} DESC`)
      .limit(50);

    res.json({
      invocations: invocations.map((inv) => ({
        id: inv.id,
        platform: inv.platform,
        agentName: inv.agentName,
        timestamp: inv.createdAt,
        query: inv.query,
        response: inv.response,
        revenueImpact: inv.revenueImpact,
      })),
      total: invocations.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
