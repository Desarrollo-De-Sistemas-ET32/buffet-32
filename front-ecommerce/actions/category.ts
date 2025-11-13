'use server';

import { connectToDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { normalizeR2ObjectUrl } from '@/lib/r2';

function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

const toPlainCategory = (category: any) => {
    const plainCategory = typeof category?.toObject === 'function' ? category.toObject() : category;
    return {
        ...plainCategory,
        image: plainCategory.image ? normalizeR2ObjectUrl(plainCategory.image) : plainCategory.image,
    };
};

export async function fetchMegamenuCategoriesAction() {
    try {
        await connectToDB();
        const categories = await Category.find().limit(4);
        const normalizedCategories = categories.map(toPlainCategory);
        return { success: true, data: JSON.parse(JSON.stringify(normalizedCategories)) };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: 'Failed to fetch categories' };
    }
}

export async function fetchCategoriesAction() {
    try {
        await connectToDB();
        const categories = await Category.find();
        const normalizedCategories = categories.map(toPlainCategory);
        return { success: true, data: JSON.parse(JSON.stringify(normalizedCategories)) };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: 'Failed to fetch categories' };
    }
}

export async function createCategoryAction(formData: {
    name: string;
    image: string;
}) {
    try {
        await connectToDB();
        const slug = slugify(formData.name);
        const category = new Category({
            name: formData.name,
            slug,
            image: normalizeR2ObjectUrl(formData.image),
        });
        await category.save();
        const normalizedCategory = toPlainCategory(category);
        return { success: true, data: JSON.parse(JSON.stringify(normalizedCategory)) };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Failed to create category' };
    }
}

export async function deleteCategoryAction(categoryId: string) {
    try {
        await connectToDB();
        const productWithCategory = await Product.exists({ category: categoryId });
        if (productWithCategory) {
            return { success: false, error: 'There are products associated with this category.' };
        }
        await Category.findByIdAndDelete(categoryId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete category' };
    }
}

export async function updateCategoryAction(categoryId: string, data: { name: string; image?: string }) {
    try {
        await connectToDB();
        const slug = slugify(data.name);
        const updateData: any = { name: data.name, slug };

        if (data.image) {
            updateData.image = normalizeR2ObjectUrl(data.image);
        }

        const category = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true }
        );
        if (!category) {
            return { success: false, error: 'Category not found' };
        }
        const normalizedCategory = toPlainCategory(category);
        return { success: true, data: JSON.parse(JSON.stringify(normalizedCategory)) };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Failed to update category' };
    }
}
