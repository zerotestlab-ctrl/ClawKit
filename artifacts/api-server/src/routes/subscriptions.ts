import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, resolvePlanForEmail } from "../lib/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/current", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, userId));
    if (!sub) {
      const [newSub] = await db
        .insert(subscriptionsTable)
        .values({ id: crypto.randomUUID(), userId, plan: "free", status: "active" })
        .returning();
      const plan = resolvePlanForEmail(user?.email, newSub.plan);
      res.json({ ...newSub, plan });
      return;
    }
    const plan = resolvePlanForEmail(user?.email, sub.plan);
    res.json({ ...sub, plan });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/upgrade", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { plan, paystackReference, paystackEmail } = req.body;
    if (!plan || !paystackReference) {
      res.status(400).json({ error: "Bad request", message: "Plan and paystack reference are required" });
      return;
    }
    if (!["growth", "scale"].includes(plan)) {
      res.status(400).json({ error: "Bad request", message: "Invalid plan" });
      return;
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const [existingSub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, userId));

    let sub;
    if (existingSub) {
      [sub] = await db
        .update(subscriptionsTable)
        .set({
          plan,
          status: "trialing",
          paystackReference,
          paystackEmail: paystackEmail || null,
          trialEndsAt,
          currentPeriodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.userId, userId))
        .returning();
    } else {
      [sub] = await db
        .insert(subscriptionsTable)
        .values({
          id: crypto.randomUUID(),
          userId,
          plan,
          status: "trialing",
          paystackReference,
          paystackEmail: paystackEmail || null,
          trialEndsAt,
          currentPeriodEnd,
        })
        .returning();
    }

    await db.update(usersTable).set({ plan: plan as "free" | "growth" | "scale" }).where(eq(usersTable.id, userId));

    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cancel", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const [sub] = await db
      .update(subscriptionsTable)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(subscriptionsTable.userId, userId))
      .returning();

    await db.update(usersTable).set({ plan: "free" }).where(eq(usersTable.id, userId));
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
