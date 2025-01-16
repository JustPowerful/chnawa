import { Model, model, models, Schema, Document } from "mongoose";

export function getModel<T extends Document>(
  modelName: string,
  schema: Schema
): Model<T> {
  return (models[modelName] || model(modelName, schema)) as Model<T>;
}
