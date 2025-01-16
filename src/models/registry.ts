import { Model, model, models, Schema } from "mongoose";

export function getModel<T>(modelName: string, schema: Schema): Model<T> {
  return models[modelName] || model(modelName, schema);
}
