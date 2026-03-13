import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable, invocationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  generateMcpManifest,
  generateAgentsMd,
  generateChatGPTSubmission,
  generateClaudeSubmission,
  generateMoltbookVariant,
  runSafetyAudit,
  generateSafetyReport,
} from "../lib/clawkit-generator.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const products = await db.select().from(productsTable).where(eq(productsTable.userId, userId));
    res.json({ products, total: products.length });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description, apiSpecUrl, apiSpecContent, websiteUrl } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: "Bad request", message: "Name and description are required" });
      return;
    }
    const [product] = await db
      .insert(productsTable)
      .values({
        id: crypto.randomUUID(),
        userId,
        name,
        description,
        apiSpecUrl: apiSpecUrl || null,
        apiSpecContent: apiSpecContent || null,
        websiteUrl: websiteUrl || null,
        generated: false,
        invocations: 0,
        revenue: 0,
      })
      .returning();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)));
    if (!product) {
      res.status(404).json({ error: "Not found", message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)));
    if (!product) {
      res.status(404).json({ error: "Not found", message: "Product not found" });
      return;
    }
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/generate", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)));
    if (!product) {
      res.status(404).json({ error: "Not found", message: "Product not found" });
      return;
    }

    const mcpManifest = generateMcpManifest(product);
    const agentsMd = generateAgentsMd(product);
    const chatgptSubmission = generateChatGPTSubmission(product);
    const claudeSubmission = generateClaudeSubmission(product);
    const moltbookVariant = generateMoltbookVariant(product);
    const { score, issues } = runSafetyAudit(product);
    const safetyReport = generateSafetyReport(product, score, issues);

    const [updated] = await db
      .update(productsTable)
      .set({
        mcpManifest,
        agentsMd,
        chatgptSubmission,
        claudeSubmission,
        moltbookVariant,
        safetyScore: score,
        safetyReport,
        generated: true,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    res.json({
      product: updated,
      mcpManifest,
      agentsMd,
      chatgptSubmission,
      claudeSubmission,
      moltbookVariant,
      safetyScore: score,
      safetyIssues: issues,
      safetyReport,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/simulate", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)));
    if (!product) {
      res.status(404).json({ error: "Not found", message: "Product not found" });
      return;
    }

    const platforms = ["chatgpt", "claude", "grok", "moltbook"] as const;
    const agentNames = {
      chatgpt: "GPT-4o Agent",
      claude: "Claude 3.7 Sonnet",
      grok: "Grok-3",
      moltbook: "Moltbook Runner v2",
    };
    const queries = [
      `How can I use ${product.name} to automate my workflow?`,
      `Integrate ${product.name} into my coding pipeline`,
      `What APIs does ${product.name} expose for agent use?`,
    ];

    const invocationsData = platforms.slice(0, 3).map((platform, i) => ({
      id: crypto.randomUUID(),
      productId: id,
      userId,
      platform,
      agentName: agentNames[platform],
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      query: queries[i % queries.length],
      response: `Successfully invoked ${product.name} via ClawKit MCP bridge. Retrieved structured data and executed the requested operation. ClawKit safety layer verified request integrity. Response time: ${Math.floor(Math.random() * 500 + 100)}ms.`,
      revenueImpact: parseFloat((Math.random() * 2.5 + 0.5).toFixed(2)),
    }));

    await Promise.all(
      invocationsData.map((inv) =>
        db.insert(invocationsTable).values({
          id: inv.id,
          productId: inv.productId,
          userId: inv.userId,
          platform: inv.platform,
          agentName: inv.agentName,
          query: inv.query,
          response: inv.response,
          revenueImpact: inv.revenueImpact,
        })
      )
    );

    const totalRevenue = invocationsData.reduce((sum, inv) => sum + inv.revenueImpact, 0);

    await db
      .update(productsTable)
      .set({
        invocations: product.invocations + invocationsData.length,
        revenue: product.revenue + totalRevenue,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id));

    res.json({
      productId: id,
      invocations: invocationsData,
      totalInvocations: invocationsData.length,
      projectedRevenue: parseFloat(totalRevenue.toFixed(2)),
      projectedMonthlyRevenue: parseFloat((totalRevenue * 30).toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/export", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const [product] = await db.select().from(productsTable).where(and(eq(productsTable.id, id), eq(productsTable.userId, userId)));
    if (!product) {
      res.status(404).json({ error: "Not found", message: "Product not found" });
      return;
    }
    res.json({
      product,
      mcpManifest: product.mcpManifest,
      agentsMd: product.agentsMd,
      chatgptSubmission: product.chatgptSubmission,
      claudeSubmission: product.claudeSubmission,
      moltbookVariant: product.moltbookVariant,
      safetyReport: product.safetyReport,
      exportedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
