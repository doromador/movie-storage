import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from "../config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        jwt.verify(token, config.secretKey);
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
}

