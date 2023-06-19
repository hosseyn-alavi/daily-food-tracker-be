import express, {Request} from "express";
import {authenticateToken} from "../utils";
import {Food, FoodInstance} from "../models/Food";

const router = express.Router();

// Add food
router.post(
    "/",
    authenticateToken,
    async (req: Request<undefined, undefined, FoodInstance>, res) => {
        try {
            const food = await Food.create(req.body);
            if (food) {
                res.json(food);
            }
        } catch {
            res.status(500).json({error: "Internal server error"});
        }
    }
);

// Get food name and calorie per 100gr
router.get("/", authenticateToken, async (req, res) => {
    try {
        const foods = await Food.findAll();
        if (foods) {
            res.json(foods);
        } else {
            res.status(404).json({error: "Food not found"});
        }
    } catch {
        res.status(500).json({error: "Internal server error"});
    }
});

router.delete(
    "/:id",
    authenticateToken,
    async (req: Request<{id: string}, undefined, FoodInstance>, res) => {
        const {id} = req.params;
        try {
            const food = await Food.destroy({where: {id}});
            if (food) {
                res.json({message: "Successfully deleted"});
            }
            {
                res.status(401).json({error: "Record not found"});
            }
        } catch {
            res.status(500).json({error: "Internal server error"});
        }
    }
);

export default router;
