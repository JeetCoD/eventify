import { model, models, Schema } from "mongoose";

//we will need to reference the schema property in the frontend application, so we will use the typescript interface that will help us to know which properties we need to use, if we miss any.
export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  createAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price?: string;
  isFree: boolean;
  url?: string;
  category: { _id: string; name: string };
  organizer: { _id: string; firstName: string; lastName: string };
}

const EventScehma = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, defautl: Date.now },
  endDateTime: { type: Date, defautl: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model("Event", EventScehma);
export default Event;
