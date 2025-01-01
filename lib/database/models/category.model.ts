import { Document, model, models, Schema } from "mongoose";

//we did this ICategory interface to define the structure of the category object
export interface ICategory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = models.Category || model("Category", CategorySchema);
export default Category;
