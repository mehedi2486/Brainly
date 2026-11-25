"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
mongoose_2.default.connect("mongodb+srv://mehedi:0ajb20e2vyDz0drR@cluster0.fw3fony.mongodb.net/second-brain");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const contentType = ["image", "video", "article", "audio"];
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    type: { type: String, enum: contentType, require: true },
    tags: [{ type: mongoose_2.default.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose_2.default.Types.ObjectId, ref: "User", require: true }
});
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
const LinkSchema = new mongoose_1.Schema({
    hash: { type: String, require: true },
    userId: { type: mongoose_2.default.Types.ObjectId, ref: "User", require: true }
});
exports.LinkModel = (0, mongoose_1.model)("link", LinkSchema);
//# sourceMappingURL=db.js.map