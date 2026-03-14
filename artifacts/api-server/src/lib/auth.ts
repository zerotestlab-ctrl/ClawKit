import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "clawkit-secret-key";

export function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(password).digest("hex");
}

export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createSessionToken(userId: string): string {
  const payload = JSON.stringify({ userId, ts: Date.now() });
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + sig;
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const payload = Buffer.from(payloadB64, "base64").toString("utf8");
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    const data = JSON.parse(payload);
    return { userId: data.userId };
  } catch {
    return null;
  }
}

export function encryptApiKey(key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SESSION_SECRET.padEnd(32, "0").slice(0, 32)), iv);
  const encrypted = Buffer.concat([cipher.update(key, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptApiKey(encrypted: string): string | null {
  try {
    const [ivHex, encHex] = encrypted.split(":");
    if (!ivHex || !encHex) return null;
    const iv = Buffer.from(ivHex, "hex");
    const encryptedBuf = Buffer.from(encHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SESSION_SECRET.padEnd(32, "0").slice(0, 32)), iv);
    return Buffer.concat([decipher.update(encryptedBuf), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** Temporary: instant Scale plan for test email. */
export function resolvePlanForEmail(email: string | undefined, actualPlan: string): string {
  if (email === "madyf0f17@gmail.com") return "scale";
  return actualPlan;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.["session"] || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
    return;
  }
  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired session" });
    return;
  }
  (req as any).userId = session.userId;
  next();
}
