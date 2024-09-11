import {Request, Response} from "express";
import jwt from "jsonwebtoken";

export interface TokenValues {
    user: {
        username: string;
        userId: number;
        dailyGoal?: number;
    };
}

// Middleware to authenticate JWT token
export function authenticateToken(
    req: Request & {user},
    res: Response,
    next: () => void
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}
