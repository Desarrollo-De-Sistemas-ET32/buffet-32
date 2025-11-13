export interface FAQItem {
  question: string;
  answer: string;
  order: number;
}

export interface FAQCategory {
  _id: string;
  name: string;
  description: string;
  faqs: FAQItem[];
  createdAt: string;
  updatedAt: string;
}

export interface EditingQuestion {
  category: FAQCategory;
  questionIndex: number;
  question: string;
  answer: string;
} 