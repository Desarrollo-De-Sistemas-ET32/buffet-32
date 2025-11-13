'use server';

import React from 'react';
import { connectToDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { Resend } from 'resend';
import { StockAlertTemplate } from "@/components/emails/StockAlertTemplate";
import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import StockAlert from '@/models/StockAlert';
import Wishlist from '@/models/Wishlist';
import { normalizeR2ObjectUrl } from '@/lib/r2';
mongoose.model('Category', Category.schema);
mongoose.model('Product', Product.schema);
mongoose.model('StockAlert', StockAlert.schema);
mongoose.model('Wishlist', Wishlist.schema);

const resend = new Resend(process.env.RESEND_API_KEY);

const normalizeImageArray = (images?: string[]) =>
  (images ?? [])
    .filter((image): image is string => Boolean(image))
    .map((image) => normalizeR2ObjectUrl(image));

const toPlainProduct = (product: any) => {
  const plainProduct =
    typeof product?.toObject === 'function' ? product.toObject() : product;

  return {
    ...plainProduct,
    images: normalizeImageArray(plainProduct.images),
  };
};

export async function getAllProducts() {
  await connectToDB();
  const products = await Product.find({}).populate('category');
  const normalizedProducts = products.map(toPlainProduct);
  return JSON.parse(JSON.stringify(normalizedProducts));
}

export async function fetchProductsAction(page: number = 1, limit: number = 10, searchName?: string, userId?: string) {
  try {
    await connectToDB();
    const skip = (page - 1) * limit;

    // Build query with optional name search
    const query: { name?: { $regex: string; $options: string } } = {};
    if (searchName && searchName.trim()) {
      query.name = { $regex: searchName.trim(), $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const plainProducts = products.map(toPlainProduct);

    // If userId is provided, check wishlist status for each product
    let productsWithWishlist = plainProducts;
    if (userId) {
      const wishlist = await Wishlist.findOne({ user: userId });
      const wishlistedProductIds = wishlist ? wishlist.products.map((p: mongoose.Types.ObjectId) => p.toString()) : [];
      
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: wishlistedProductIds.includes(product._id.toString())
      }));
    } else {
      // If no userId, mark all products as not wishlisted
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: false
      }));
    }

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(productsWithWishlist)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function fetchFeaturedProductsAction(maxProducts: number = 8, userId?: string) {
  try {
    await connectToDB();

    // Debug: Check what products exist
    const allProducts = await Product.find({}).populate('category');
    console.log('All products:', allProducts.map(p => ({ id: p._id, name: p.name, isFeatured: p.isFeatured, stock: p.stock, isActive: p.isActive })));

    const products = await Product.find({
      isFeatured: true,
      stock: { $gt: 0 },
      isActive: true
    })
      .limit(maxProducts)
      .populate('category');

    const plainProducts = products.map(toPlainProduct);

    // If userId is provided, check wishlist status for each product
    let productsWithWishlist = plainProducts;
    if (userId) {
      const wishlist = await Wishlist.findOne({ user: userId });
      const wishlistedProductIds = wishlist ? wishlist.products.map((p: mongoose.Types.ObjectId) => p.toString()) : [];
      
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: wishlistedProductIds.includes(product._id.toString())
      }));
    } else {
      // If no userId, mark all products as not wishlisted
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: false
      }));
    }

    console.log('Featured products found:', productsWithWishlist.length);
    console.log('Featured products:', productsWithWishlist.map(p => ({ id: p._id, name: p.name, isFeatured: p.isFeatured, stock: p.stock, isActive: p.isActive })));

    return { success: true, data: JSON.parse(JSON.stringify(productsWithWishlist)) };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { success: false, error: 'Failed to fetch featured products' };
  }
}

export async function fetchProductByIdAction(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid product id' };
    }
    await connectToDB();
    const product = await Product.findById(id).populate('category');
    if (!product || !product.isActive) {
      return { success: false, error: 'Product not found' };
    }
    const normalizedProduct = toPlainProduct(product);
    return { success: true, data: JSON.parse(JSON.stringify(normalizedProduct)) };
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return { success: false, error: 'Failed to fetch product by id' };
  }
}

export async function fetchProductActionsByName(searchQuery: string) {
  try {
    await connectToDB();
    const query: FilterQuery<typeof Product> = { isActive: true };
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ name: 1 }).limit(3);
    const normalizedProducts = products.map(toPlainProduct);
    return { success: true, data: JSON.parse(JSON.stringify(normalizedProducts)) };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function fetchProductsActionBySearch(searchQuery: string, category: string = 'all', priceOrder: string = '', withDiscount: boolean = false, featured: boolean = false, skip: number = 0, limit: number = 8, userId?: string) {
  try {
    await connectToDB();
    const query: FilterQuery<typeof Product> = { isActive: true };
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({ slug: category });
      if (!categoryDoc) {
        return { success: true, data: [], hasMore: false };
      }
      query.category = categoryDoc._id;
    }
    if (withDiscount) {
      query.discount = { $gt: 0 };
    }
    if (featured) {
      query.isFeatured = true;
    }
    let sort: Record<string, 1 | -1> = { name: 1 };
    if (priceOrder === 'asc') sort = { price: 1 };
    if (priceOrder === 'desc') sort = { price: -1 };
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('category');

    const plainProducts = products.map(toPlainProduct);

    // If userId is provided, check wishlist status for each product
    let productsWithWishlist = plainProducts;
    if (userId) {
      const wishlist = await Wishlist.findOne({ user: userId });
      const wishlistedProductIds = wishlist ? wishlist.products.map((p: mongoose.Types.ObjectId) => p.toString()) : [];
      
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: wishlistedProductIds.includes(product._id.toString())
      }));
    } else {
      // If no userId, mark all products as not wishlisted
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: false
      }));
    }
    
    const totalCount = await Product.countDocuments(query);
    const hasMore = totalCount > skip + products.length;
    return { success: true, data: JSON.parse(JSON.stringify(productsWithWishlist)), hasMore };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: 'Failed to fetch products' };
  }
}

export async function createProductAction(formData: {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive?: boolean;
  stock: number;
  discount: number;
  images?: string[];
  isFeatured?: boolean;
}) {
  try {
    await connectToDB();

    const product = new Product({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      isActive: formData.isActive ?? true,
      images: normalizeImageArray(formData.images),
      stock: formData.stock,
      discount: formData.discount,
      isFeatured: formData.isFeatured ?? false,
    });

    await product.save();

    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await connectToDB();
    await Product.findByIdAndDelete(productId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function fetchRelatedProductsAction(categoryId: string, excludeProductId?: string, userId?: string) {
  try {
    await connectToDB();
    const query: FilterQuery<typeof Product> = { category: categoryId, isActive: true };
    if (excludeProductId) {
      query._id = { $ne: excludeProductId };
    }
    const products = await Product.find(query).populate('category');

    const plainProducts = products.map(toPlainProduct);

    // If userId is provided, check wishlist status for each product
    let productsWithWishlist = plainProducts;
    if (userId) {
      const wishlist = await Wishlist.findOne({ user: userId });
      const wishlistedProductIds = wishlist ? wishlist.products.map((p: mongoose.Types.ObjectId) => p.toString()) : [];
      
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: wishlistedProductIds.includes(product._id.toString())
      }));
    } else {
      // If no userId, mark all products as not wishlisted
      productsWithWishlist = plainProducts.map(product => ({
        ...product,
        isWishlisted: false
      }));
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(productsWithWishlist)) };
  } catch (error) {
    console.error('Error fetching related products:', error);
    return { success: false, error: 'Failed to fetch related products' };
  }
}

export async function updateProductAction(productId: string, data: {
  name: string;
  description: string;
  price: number;
  category?: string;
  isActive?: boolean;
  stock: number;
  discount: number;
  images?: string[];
  isFeatured?: boolean;
}) {
  try {
    await connectToDB();

    const currentProduct = await Product.findById(productId);
    const previousStock = currentProduct?.stock || 0;

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        name: data.name,
        description: data.description,
        price: data.price,
        ...(data.category && { category: data.category }),
        ...(typeof data.isActive === 'boolean' && { isActive: data.isActive }),
        ...(typeof data.isFeatured === 'boolean' && { isFeatured: data.isFeatured }),
        stock: data.stock,
        discount: data.discount,
        images: normalizeImageArray(data.images),
      },
      { new: true }
    );

    const shouldSendStockAlerts = previousStock === 0 && data.stock > 0;

    const normalizedProduct = updated ? toPlainProduct(updated) : null;

    return {
      success: true,
      data: JSON.parse(JSON.stringify(normalizedProduct)),
      shouldSendStockAlerts
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function sendStockAlertEmailsAction(productId: string) {
  try {
    const product = await Product.findById(productId);
    if (!product) return { success: false, error: 'Product not found' };

    const normalizedProduct = toPlainProduct(product);

    const stockAlerts = await StockAlert.find({ product: productId });

    if (stockAlerts.length === 0) {
      return { success: true, message: 'No stock alerts found' };
    }

    // Send emails in parallel for better performance
    const emailPromises = stockAlerts.map(async (alert) => {
      try {
        await StockAlert.findByIdAndUpdate(alert._id, { notified: true });
        return resend.emails.send({
          from: 'Snackly <no-reply@snackly.site>',
          to: alert.email,
          subject: 'Product Stock Alert',
          react: React.createElement(StockAlertTemplate, {
            productName: normalizedProduct.name,
            productImage: normalizedProduct.images?.[0] || '',
            productPrice: normalizedProduct.price,
            productUrl: `https://snackly.site/product/${productId}`
          }),
        });
      } catch (error) {
        console.error(`Failed to send email to ${alert.email}:`, error);
        throw error;
      }
    });

    await Promise.all(emailPromises);
    return { success: true, message: `Sent ${stockAlerts.length} stock alert emails` };
  } catch (error) {
    console.error('Error sending stock alert emails:', error);
    return { success: false, error: 'Failed to send emails' };
  }
}

export async function markProductsAsFeaturedAction() {
  try {
    await connectToDB();

    // Get the first 6 active products and mark them as featured
    const products = await Product.find({ isActive: true, stock: { $gt: 0 } }).limit(6);

    if (products.length === 0) {
      return { success: false, error: 'No products found to mark as featured' };
    }

    const updatePromises = products.map(product =>
      Product.findByIdAndUpdate(product._id, { isFeatured: true }, { new: true })
    );

    const updatedProducts = await Promise.all(updatePromises);
    const normalizedProducts = updatedProducts.map(toPlainProduct);

    console.log(`Marked ${updatedProducts.length} products as featured`);
    return { success: true, data: JSON.parse(JSON.stringify(normalizedProducts)) };
  } catch (error) {
    console.error('Error marking products as featured:', error);
    return { success: false, error: 'Failed to mark products as featured' };
  }
}

export async function fetchProductsAnalyticsAction(startDate?: string, endDate?: string) {
  try {
    await connectToDB();

    const query: { createdAt?: { $gte?: Date; $lte?: Date } } = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const products = await Product.find(query).populate('category').sort({ createdAt: -1 });
    const normalizedProducts = products.map(toPlainProduct);
    return { success: true, data: JSON.parse(JSON.stringify(normalizedProducts)) };
  } catch (error) {
    console.error('Error fetching products for analytics:', error);
    return { success: false, error: 'Failed to fetch products for analytics' };
  }
} 
