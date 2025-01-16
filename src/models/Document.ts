import mongoose, { Schema } from "mongoose";
import { getModel } from "./registry";

export interface IDocument extends mongoose.Document {
  title: string;
  fullname: string;
  subjectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sessionNumber: number;
  classref: string;
  objectives: string[];
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    classref: {
      type: String,
      required: true,
    },
    objectives: {
      type: [String],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Document = getModel<IDocument>("Document", documentSchema);
export default Document;
