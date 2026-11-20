import rateLimit from "express-rate-limit"
import { success } from "zod"

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again later in 15 minutes"
    }
})