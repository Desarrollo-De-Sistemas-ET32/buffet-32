import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const getProducts = async () => {
    try {
        await connectToDB();
        const products = await Product.find();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw new Error("No se pudieron obtener los productos");
    }
};