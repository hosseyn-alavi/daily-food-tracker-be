import express, {type Request, type Response} from "express";
import jwt from "jsonwebtoken";
import {User, type UserInstance} from "../models/User";

const router = express.Router();
// Login endpoint
router.post(
    "/login",
    async (req: Request<undefined, undefined, UserInstance>, res: Response) => {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                password: req.body.password,
            },
        });

        if (user) {
            // Generate JWT token
            const token = jwt.sign(
                {
                    username: req.body.username,
                    userId: user.id,
                    dailyGoal: user.dailyGoal ?? 0,
                },
                process.env.SECRET_KEY ?? "",
                {
                    expiresIn: "7d",
                }
            );

            res.json({token});
        } else {
            res.status(401).json({error: "Invalid credentials"});
        }
    }
);

router.post(
    "/signup",
    async (
        req: Request<
            undefined,
            undefined,
            UserInstance & {securityToken: string}
        >,
        res: Response
    ) => {
        if (req.body.securityToken === process.env.SECURITY_SIGN_UP_TOKEN) {
            try {
                const user = await User.create(req.body);

                res.json({message: "user created successfully", user});
            } catch {
                res.status(500).json({error: "Something went wrong"});
            }
        } else {
            res.status(401).json({error: "Invalid token"});
        }
    }
);
export default router;
