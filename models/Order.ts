import mongoose, {
  InferSchemaType,
  Model,
  Schema,
} from "mongoose";

export const ORDER_STATUSES = [
  "pending-payment",
  "payment-confirmed",
  "processing",
  "ready-for-dispatch",
  "dispatched",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

const orderItemSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const trackingHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "EcoVolt Nexus",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },

    trackingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },

    customer: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },

    delivery: {
      county: {
        type: String,
        required: true,
        trim: true,
      },
      town: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      notes: {
        type: String,
        default: "",
        trim: true,
      },
      method: {
        type: String,
        enum: ["standard", "express", "pickup"],
        required: true,
      },
      fee: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    payment: {
      method: {
        type: String,
        enum: ["mpesa", "card", "bank-transfer"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      reference: {
        type: String,
        default: "",
        trim: true,
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items: unknown[]) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "An order must contain at least one item.",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "KES",
      uppercase: true,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending-payment",
      index: true,
    },

    estimatedDelivery: {
      type: Date,
      default: null,
    },

    trackingHistory: {
      type: [trackingHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export type OrderDocument =
  InferSchemaType<typeof orderSchema>;

const Order: Model<OrderDocument> =
  mongoose.models.Order
    ? (mongoose.models.Order as Model<OrderDocument>)
    : mongoose.model<OrderDocument>(
        "Order",
        orderSchema,
      );

export default Order;