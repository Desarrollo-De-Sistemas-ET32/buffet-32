import mongoose from "mongoose";


const PageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

export default Page;