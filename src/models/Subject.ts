import mongoose, { Model, Schema } from "mongoose";

export interface ISubject extends Document {
  title: string;
  userId: Schema.Types.ObjectId;
  description?: string;
  teacherName?: string;
  teacherEmail?: string;
}

const SubjectSchema = new Schema(
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

let Subject: Model<ISubject>;

try {
  Subject = mongoose.model<ISubject>("Subject");
} catch (error) {
  Subject = mongoose.model<ISubject>("Subject", SubjectSchema);
}

export default Subject;
