import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      res.status(400).json({ error: "Bad request", message: "Email is required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Bad request", message: "Invalid email format" });
      return;
    }

    const [existing] = await db.select().from(waitlistTable).where(eq(waitlistTable.email, email.toLowerCase()));
    if (existing) {
      res.status(409).json({ error: "Conflict", message: "You're already on the waitlist!" });
      return;
    }

    const [entry] = await db
      .insert(waitlistTable)
      .values({ email: email.toLowerCase(), name: name || null })
      .returning();

    const countResult = await db.select().from(waitlistTable);
    const position = countResult.length;

    res.status(201).json({
      id: String(entry.id),
      email: entry.email,
      position,
      message: `You're #${position} on the waitlist! We'll be in touch soon.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
