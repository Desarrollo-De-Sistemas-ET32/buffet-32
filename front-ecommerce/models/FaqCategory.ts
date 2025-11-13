import mongoose from 'mongoose';

const faqItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const faqCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  faqs: {
    type: [faqItemSchema],
    default: [],
  },
}, { timestamps: true });

const FaqCategory = mongoose.models.FaqCategory || mongoose.model('FaqCategory', faqCategorySchema);

export default FaqCategory;