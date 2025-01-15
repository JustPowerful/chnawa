import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  classref: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    classref: { type: String, required: true }, // class reference is the class code that the user is in
    // it can also be the clas name or anything that represents the class
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

let User: Model<IUser>;

try {
  User = mongoose.model<IUser>("User");
} catch {
  User = mongoose.model<IUser>("User", UserSchema);
}

export default User;
