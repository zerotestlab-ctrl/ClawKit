import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { userSettingsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, encryptApiKey } from "../lib/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const [settings] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, userId));
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!settings) {
      const [newSettings] = await db
        .insert(userSettingsTable)
        .values({ id: crypto.randomUUID(), userId, emailNotifications: true })
        .returning();
      res.json({
        userId,
        grokApiKeySet: false,
        emailNotifications: newSettings.emailNotifications,
        plan: user?.plan || "free",
      });
      return;
    }
    res.json({
      userId,
      grokApiKeySet: !!settings.grokApiKeyEncrypted,
      emailNotifications: settings.emailNotifications,
      plan: user?.plan || "free",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { grokApiKey, emailNotifications } = req.body;

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (grokApiKey !== undefined && grokApiKey !== null && grokApiKey !== "") {
      updateData.grokApiKeyEncrypted = encryptApiKey(grokApiKey);
    }
    if (emailNotifications !== undefined) {
      updateData.emailNotifications = emailNotifications;
    }

    const [existing] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, userId));
    let settings;
    if (existing) {
      [settings] = await db.update(userSettingsTable).set(updateData).where(eq(userSettingsTable.userId, userId)).returning();
    } else {
      [settings] = await db
        .insert(userSettingsTable)
        .values({ id: crypto.randomUUID(), userId, ...updateData })
        .returning();
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    res.json({
      userId,
      grokApiKeySet: !!settings.grokApiKeyEncrypted,
      emailNotifications: settings.emailNotifications,
      plan: user?.plan || "free",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
