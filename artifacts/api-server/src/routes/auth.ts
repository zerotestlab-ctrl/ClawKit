import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable, subscriptionsTable, userSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, createSessionToken, requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Bad request", message: "Email and password are required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (!user || !comparePassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }
    const token = createSessionToken(user.id);
    res.cookie("session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, createdAt: user.createdAt },
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Bad request", message: "Email, password, and name are required" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (existing) {
      res.status(409).json({ error: "Conflict", message: "Email already registered" });
      return;
    }
    const [user] = await db
      .insert(usersTable)
      .values({ id: crypto.randomUUID(), email: email.toLowerCase(), passwordHash: hashPassword(password), name, plan: "free" })
      .returning();

    await db.insert(subscriptionsTable).values({
      id: crypto.randomUUID(),
      userId: user.id,
      plan: "free",
      status: "active",
    });

    await db.insert(userSettingsTable).values({
      id: crypto.randomUUID(),
      userId: user.id,
      emailNotifications: true,
    });

    const token = createSessionToken(user.id);
    res.cookie("session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, createdAt: user.createdAt },
      message: "Registration successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("session");
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
