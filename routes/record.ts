import express, {Request} from "express";
import {TokenValues, authenticateToken} from "../utils";
import {DailyRecord, DailyRecordInstance} from "../models/DailyRecord";

const router = express.Router();

// Get daily record with date and food name (id) and amount
router.get(
    "/:date",
    authenticateToken,
    async (req: Request & TokenValues, res) => {
        const {date} = req.params;
        try {
            const records = await DailyRecord.findAll({
                where: {date, userId: req.user.userId},
            });
            if (records) {
                res.json({records, dailyGoal: req.user.dailyGoal});
            }
        } catch {
            return res.status(500).json({error: "Internal server error"});
        }
    }
);

router.post(
    "/:date",
    authenticateToken,
    async (
        req: Request<{date: string}, undefined, DailyRecordInstance> &
            TokenValues,
        res
    ) => {
        try {
            const {date} = req.params;
            const record = await DailyRecord.create({
                ...req.body,
                userId: req.user.userId,
                date,
            });
            if (record) {
                res.json({message: "Record added successfully", record});
            }
        } catch {
            res.status(500).json({error: "Failed to add record"});
        }
    }
);

router.delete(
    "/:id",
    authenticateToken,
    async (req: Request<{id: string}, undefined, DailyRecordInstance>, res) => {
        const {id} = req.params;
        try {
            const record = await DailyRecord.destroy({where: {id}});
            if (record) {
                res.json({message: "Successfully deleted"});
            } else {
                res.status(401).json({error: "Record not found"});
            }
        } catch {
            res.status(500).json({error: "Internal server error"});
        }
    }
);

export default router;
