
import mongoose from 'mongoose';

const homeConfigSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        required: true,
        default: 'Discover Your Perfect Style',
    },
    heroDescription: {
        type: String,
        required: true,
        default: 'Explore our curated collection of premium fashion, accessories, and lifestyle products. Elevate your wardrobe with pieces that define your unique style.',
    },
    heroImage: {
        type: String,
        required: true,
        default: 'https://placehold.co/1920x1080.png',
    },
    heroPrimaryButtonText: {
        type: String,
        required: true,
        default: 'Shop Now',
    },
    heroPrimaryButtonLink: {
        type: String,
        required: true,
        default: '/products',
    },
    heroSecondaryButtonText: {
        type: String,
        required: true,
        default: 'Learn More',
    },
    heroSecondaryButtonLink: {
        type: String,
        required: true,
        default: '/products',
    },  
    featuredProducts: {
        isEnabled: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            default: 'Featured Products',
        },
        layout: {
            type: String,
            enum: ['grid', 'carousel'],
            default: 'grid',
        },
        maxProducts: {
            type: Number,
            min: 1,
            max: 12,
            default: 6,
        },
        autoPlay: {
            type: Boolean,
            default: true,
        },
        showViewAllButton: {
            type: Boolean,
            default: true,
        },
        viewAllButtonText: {
            type: String,
            default: 'View All Products',
        },
    },
    showCategoryBanners: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const HomeConfig = mongoose.models.HomeConfig || mongoose.model('HomeConfig', homeConfigSchema);

export default HomeConfig;