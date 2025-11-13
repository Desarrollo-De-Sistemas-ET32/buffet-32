import { Package, Truck, CreditCard, Leaf, Shield, HelpCircle } from "lucide-react"

export interface FAQItem {
  question: string
  answer: string
  order: number
}

export interface FAQCategory {
  name: string
  description: string
  faqs: FAQItem[]
}

// New structure for database seeding
export const faqCategories: FAQCategory[] = [
  {
    name: "Shipping & Orders",
    description: "Everything you need to know about shipping, tracking, and order management",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "We offer free standard shipping (5-7 business days) on orders over $50. Express shipping (2-3 business days) is available for $9.99. Orders are processed within 1-2 business days.",
        order: 1
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status in your profile dashboard under 'Orders'.",
        order: 2
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within the United States. We're working on expanding to international shipping in the near future.",
        order: 3
      },
      {
        question: "What if my order arrives damaged?",
        answer: "We're sorry if your order arrives damaged! Please contact us within 48 hours with photos of the damaged items, and we'll send a replacement or provide a full refund.",
        order: 4
      }
    ]
  },
  {
    name: "Products",
    description: "Learn about our nut products, freshness, and quality standards",
    faqs: [
      {
        question: "How fresh are your nuts?",
        answer: "All our nuts are stored in climate-controlled facilities and packaged fresh to order. We guarantee freshness for 6-12 months depending on the variety. Each package includes a 'packed on' date.",
        order: 1
      },
      {
        question: "Are your nuts organic?",
        answer: "We offer both organic and conventional nuts. Organic options are clearly marked on product pages. All our suppliers follow strict quality and safety standards regardless of organic certification.",
        order: 2
      },
      {
        question: "Do you have allergen information?",
        answer: "Yes, detailed allergen information is available on each product page. Our facility processes tree nuts, so cross-contamination is possible. Please contact us if you have specific allergen concerns.",
        order: 3
      },
      {
        question: "What's the difference between raw and roasted nuts?",
        answer: "Raw nuts are unprocessed and maintain their natural enzymes and nutrients. Roasted nuts have enhanced flavor and crunch but may have slightly reduced nutritional content. Both are healthy choices!",
        order: 4
      }
    ]
  },
  {
    name: "Payment & Returns",
    description: "Information about payment methods, returns, and order cancellation",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.",
        order: 1
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, contact us for a full refund or exchange. Items must be unopened and in original packaging.",
        order: 2
      },
      {
        question: "How do I cancel my order?",
        answer: "Orders can be cancelled within 2 hours of placement by contacting customer service. After processing begins, we cannot cancel orders, but you can return items once received.",
        order: 3
      }
    ]
  },
  {
    name: "Account",
    description: "Account management, password reset, and profile settings",
    faqs: [
      {
        question: "Do I need an account to place an order?",
        answer: "No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, view order history, and receive exclusive offers.",
        order: 1
      },
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.",
        order: 2
      },
      {
        question: "Can I change my shipping address after ordering?",
        answer: "Address changes are possible within 2 hours of placing your order. After that, orders enter processing and addresses cannot be modified. Contact us immediately if you need to change an address.",
        order: 3
      }
    ]
  },
  {
    name: "Storage",
    description: "Best practices for storing and preserving your nuts",
    faqs: [
      {
        question: "How should I store my nuts?",
        answer: "Store nuts in a cool, dry place in airtight containers. Refrigeration extends freshness for up to 1 year, and freezing can preserve nuts for up to 2 years without affecting taste or nutrition.",
        order: 1
      }
    ]
  },
  {
    name: "Nutrition",
    description: "Health benefits and nutritional information about nuts",
    faqs: [
      {
        question: "Are nuts good for weight loss?",
        answer: "Yes! Nuts are nutrient-dense and can help with weight management when eaten in moderation. They provide healthy fats, protein, and fiber that help you feel satisfied longer.",
        order: 1
      },
      {
        question: "Which nuts are best for heart health?",
        answer: "Walnuts, almonds, and pistachios are particularly beneficial for heart health due to their omega-3 fatty acids, vitamin E, and magnesium content. All tree nuts support cardiovascular health.",
        order: 2
      }
    ]
  }
]

export const categories = [
  { id: "all", name: "All Questions", icon: HelpCircle },
  { id: "shipping", name: "Shipping & Orders", icon: Truck },
  { id: "products", name: "Products", icon: Package },
  { id: "payment", name: "Payment & Returns", icon: CreditCard },
  { id: "account", name: "Account", icon: Shield },
  { id: "storage", name: "Storage", icon: Leaf },
  { id: "nutrition", name: "Nutrition", icon: Leaf },
]