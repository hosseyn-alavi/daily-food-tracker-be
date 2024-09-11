import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export interface TokenValues {
    user: {
        username: string;
        userId: number;
        dailyGoal?: number;
    };
}

// Middleware to authenticate JWT token
// export function authenticateToken(
//     req: Request & TokenValues,
//     res: Response,
//     next: () => void
// ) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//     if (token == null) {
//         return res.sendStatus(401);
//     }

//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     jwt.verify(token, process.env.SECRET_KEY ?? "", (err: any, user: any) => {
//         if (err) {
//             return res.sendStatus(403);
//         }

//         req.user = user;
//         next();
//     });
// }

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    jwt.verify(token, process.env.SECRET_KEY ?? "", (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        // Here, we explicitly cast req to include user
        (req as Request & TokenValues).user = user;

        next();
    });
};
