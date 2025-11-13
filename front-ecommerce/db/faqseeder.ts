import { faqCategories } from "@/data/faq";
import FaqCategory from "@/models/FaqCategory";

export const seedItems = async () => {
    try {
        const existingFaq = await FaqCategory.find();
        if (existingFaq.length === 0) {
            await FaqCategory.create(faqCategories);
            console.log('FAQ categories inicializados exitosamente.');
        } else {
            console.log('Ya existen FAQ categories en la base de datos.');
        }

    } catch (error) {
        console.error('Error al inicializar FAQ categories en la base de datos:', error);
    }
};