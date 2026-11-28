import express from "express";
import { z } from "zod";
import { ContentModel, UserModel, LinkModel } from "./db";
import { hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();

app.use(express.json());

const signupSchema = z.object({
  username: z.string().trim().min(3).max(10),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(/[A-Z]/, "Need one uppercase letter")
    .regex(/[a-z]/, "Need one lowercase letter")
    .regex(/[0-9]/, "Need one number"),
});

app.post("/api/v1/signup", async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        errors: result.error.flatten(),
      });
      return;
    }

    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await hash(password, 10);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User signup successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });

  if (!user) {
    res.json({
      message: "user not found",
    });
    return;
  }

  if (!user.password) {
    res.status(500).json({
      message: "User password is missing",
    });
    return;
  }

  const validUser = await compare(password, user.password);

  if (validUser) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET,
    );

    res.json({
      token: token,
    });
  } else {
    res.status(411).json({
      msg: "user not varified",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { title, link } = req.body;

  //@ts-ignore
  const userId = req.userId;

  const content = await ContentModel.create({
    title,
    link,
    userId: userId,
    tags: [],
  });

  res.status(201).json({
    message: "Content created successfully",
    content,
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId: req.userId,
  });
  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
      //@ts-ignore
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });

      return;
    }

    const hash = random(10);
    await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash: hash,
    }); 

    res.json({
      message: "hash :" + hash,
    });
  } else {
    await LinkModel.deleteOne({
      //@ts-ignore
      userId: req.userId,
    });
    res.json({
      message: "Remove link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }

  if (link.userId == null) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }

  //userId
  const content = await ContentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "user not found",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});

app.listen(3000);
