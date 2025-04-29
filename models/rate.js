import mongoose from 'mongoose';

const RateSchema = new mongoose.Schema(
  {
    basecountry: {
      type: String,
      required: true,
    },
    foreigncurrency: {
      type: String,
      required: true,
    },
    fromcountry: {
      type: String,
      required: true,
    },
    tocountry: {
      type: String,
      required: true,
    },
    ratecurrency: {
      type: Number,
      required: true,
    },
    transfertype: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'], // optional: to control allowed status values
      default: 'active'
    },
    unit: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true // ✅ Automatically adds createdAt and updatedAt
  }
);

// Avoid model overwrite error in Next.js (important for hot-reload during dev)
const RateModel = mongoose.models.Rate || mongoose.model('Rate', RateSchema);

export default RateModel;
