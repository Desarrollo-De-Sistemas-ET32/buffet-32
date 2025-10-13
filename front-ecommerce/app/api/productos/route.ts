import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { productos } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const allProducts = await db.select().from(productos);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newProductData = await req.json();
    if (!newProductData || !newProductData.name || !newProductData.price) {
      return NextResponse.json({ error: 'Missing required product data' }, { status: 400 });
    }

    const [newProduct] = await db.insert(productos).values(newProductData).returning();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}