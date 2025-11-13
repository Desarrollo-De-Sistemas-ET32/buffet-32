// models/Category.ts
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Creamos el modelo de producto
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
