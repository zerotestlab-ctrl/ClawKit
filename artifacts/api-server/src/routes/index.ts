import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import waitlistRouter from "./waitlist";
import productsRouter from "./products";
import analyticsRouter from "./analytics";
import subscriptionsRouter from "./subscriptions";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/waitlist", waitlistRouter);
router.use("/products", productsRouter);
router.use("/analytics", analyticsRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/settings", settingsRouter);

export default router;
