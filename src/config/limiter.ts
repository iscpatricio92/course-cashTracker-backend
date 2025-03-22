import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // limit each IP to 5 requests per windowMs
    message: {"error":"Too many requests from this IP, please try again after a minute"}
});