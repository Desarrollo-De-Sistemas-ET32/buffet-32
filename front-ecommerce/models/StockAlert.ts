
import mongoose from 'mongoose';

const stockAlertSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

stockAlertSchema.index({ email: 1, product: 1 }, { unique: true });

const StockAlert = mongoose.models.StockAlert || mongoose.model('StockAlert', stockAlertSchema);

export default StockAlert;