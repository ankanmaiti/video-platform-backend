import { Schema, model, InferSchemaType, Document } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // who subscribe
      ref: 'User'
    },
    channel: {
      type: Schema.Types.ObjectId, // to whom subcribe
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
)

export const Subscription = model('Subscription', subscriptionSchema)
export type SubscriptionType = InferSchemaType<typeof subscriptionSchema> & Document
