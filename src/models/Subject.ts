import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "./registry";

export interface ISubject extends Document {
  title: string;
  userId: mongoose.Types.ObjectId;
  description?: string;
  teacherName?: string;
  teacherEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema(
  {
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String }, // optional
    teacherName: { type: String }, // optional
    teacherEmail: { type: String }, // optional
  },
  {
    timestamps: true,
  }
);

const Subject = getModel<ISubject>("Subject", subjectSchema);
export default Subject;
