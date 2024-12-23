import mongoose, {
  Schema,
  Model,
  Document as DocumentInterface,
  model,
} from "mongoose";

interface IDocument extends DocumentInterface {
  title: string;
  fullname: string;
  subjectId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  sessionNumber: number;
  classref: string;
  objectives: string[]; // Array of strings due to the fact the objectives can be multiple
}

const DocumentSchema = new Schema<IDocument>({
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
});

let Document: Model<IDocument>;
try {
  Document = model<IDocument>("Document");
} catch (error) {
  Document = model<IDocument>("Document", DocumentSchema);
}

export default Document;
