import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ['mercadopago', 'cash'],
    default: 'mercadopago',
    required: true,
  },
  paymentId: {
    type: String,
    required: function () {
      return this.paymentMethod === 'mercadopago';
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'pending_shipping', 'shipping', 'delivered'],
    default: 'pending',
  },
  shippingData: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    dni: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    division: {
      type: String,
    },
  },
  appliedCoupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  },
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
