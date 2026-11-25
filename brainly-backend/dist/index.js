"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("./db");
const bcrypt_ts_1 = require("bcrypt-ts");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3).max(10),
    password: zod_1.z.string().min(8).max(20)
        .regex(/[A-Z]/, "Need one uppercase letter")
        .regex(/[a-z]/, "Need one lowercase letter")
        .regex(/[0-9]/, "Need one number")
});
app.post("/api/v1/signup", async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                errors: result.error.flatten()
            });
            return;
        }
        const { username, password } = result.data;
        const existingUser = await db_1.UserModel.findOne({
            username
        });
        if (existingUser) {
            res.status(409).json({
                message: "User already exists"
            });
            return;
        }
        const hashedPassword = await (0, bcrypt_ts_1.hash)(password, 10);
        await db_1.UserModel.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User signup successful"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await db_1.UserModel.findOne({ username: username });
    if (!user) {
        res.json({
            message: "user not found"
        });
        return;
    }
    if (!user.password) {
        res.status(500).json({
            message: "User password is missing"
        });
        return;
    }
    const validUser = await (0, bcrypt_ts_1.compare)(password, user.password);
    if (validUser) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, config_1.JWT_SECRET);
        res.json({
            token: token
        });
    }
    else {
        res.status(411).json({
            msg: "user not varified"
        });
    }
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { title, link } = req.body;
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.ContentModel.create({
        title,
        link,
        userId: userId,
        tags: []
    });
    res.status(201).json({
        message: "Content created successfully",
        content
    });
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await db_1.ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Deleted"
    });
});
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.body;
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
//# sourceMappingURL=index.js.map