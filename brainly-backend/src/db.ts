import { Schema, model } from "mongoose"
import mongoose from "mongoose";

mongoose.connect("")

const UserSchema = new Schema({
    username: {type: String, require:true, unique:true},
    password: {type: String, require:true}
})

export const UserModel = model("User", UserSchema);
const contentType = ["image", "video", "article", "audio"]

const ContentSchema = new Schema({
    title: String,
    link: String,
    type:{type:String, enum:contentType, require:true },
    tags: [{type: mongoose.Types.ObjectId, ref: "Tag"}],
    userId: {type: mongoose.Types.ObjectId, ref: "User", require: true}
})

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: {type:String, require: true},
    userId: {type:mongoose.Types.ObjectId, ref:"User", require:true, unique:true}
})

export const LinkModel = model("link", LinkSchema);