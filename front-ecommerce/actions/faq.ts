"use server";

import { connectToDB } from "@/lib/mongodb";
import FaqCategory from "@/models/FaqCategory";
import { FAQItem } from "@/data/faq";

export async function getFaqs() {
    try {
        await connectToDB();
        const faqs = await FaqCategory.find().sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(faqs)) };
    } catch (error) {
        console.error('Error fetching faqs:', error);
        return { success: false, error: 'Failed to fetch faqs' };
    }
}

export async function createFaqCategory(name: string, description: string) {
    try {
        await connectToDB();
        const newCategory = await FaqCategory.create({
            name,
            description,
            faqs: []
        });
        return { success: true, data: JSON.parse(JSON.stringify(newCategory)) };
    } catch (error) {
        console.error('Error creating FAQ category:', error);
        return { success: false, error: 'Failed to create FAQ category' };
    }
}

export async function addQuestionToCategory(categoryId: string, question: string, answer: string) {
    try {
        await connectToDB();
        const category = await FaqCategory.findById(categoryId);
        if (!category) {
            return { success: false, error: 'Category not found' };
        }

        const newQuestion = {
            question,
            answer,
            order: category.faqs.length
        };

        category.faqs.push(newQuestion);
        await category.save();

        return { success: true, data: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error('Error adding question to category:', error);
        return { success: false, error: 'Failed to add question' };
    }
}

export async function updateQuestion(categoryId: string, questionIndex: number, question: string, answer: string) {
    try {
        await connectToDB();
        const category = await FaqCategory.findById(categoryId);
        if (!category) {
            return { success: false, error: 'Category not found' };
        }

        if (questionIndex >= category.faqs.length) {
            return { success: false, error: 'Question not found' };
        }

        category.faqs[questionIndex].question = question;
        category.faqs[questionIndex].answer = answer;
        await category.save();

        return { success: true, data: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error('Error updating question:', error);
        return { success: false, error: 'Failed to update question' };
    }
}

export async function deleteQuestion(categoryId: string, questionIndex: number) {
    try {
        await connectToDB();
        const category = await FaqCategory.findById(categoryId);
        if (!category) {
            return { success: false, error: 'Category not found' };
        }

        if (questionIndex >= category.faqs.length) {
            return { success: false, error: 'Question not found' };
        }

        category.faqs.splice(questionIndex, 1);
        // Reorder remaining questions
        category.faqs.forEach((faq: { order: number }, index: number) => {
            faq.order = index;
        });
        await category.save();

        return { success: true, data: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error('Error deleting question:', error);
        return { success: false, error: 'Failed to delete question' };
    }
}

export async function deleteCategory(categoryId: string) {
    try {
        await connectToDB();
        await FaqCategory.findByIdAndDelete(categoryId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}