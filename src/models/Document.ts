import mongoose, {
  Schema,
  Model,
  Document as DocumentInterface,
  model,
} from "mongoose";
import { getModel } from "./registry";

interface IDocument extends DocumentInterface {
  title: string;
  fullname: string;
  subjectId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  sessionNumber: number;
  classref: string;
  objectives: string[]; // Array of strings due to the fact the objectives can be multiple
  content: Schema.Types.Mixed; // Mixed type to store any type of data
}

const documentSchema = new Schema<IDocument>({
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
});

// // sync indexes content
// await mongoose.syncIndexes();

const Document = getModel("Document", documentSchema);
export default Document;
