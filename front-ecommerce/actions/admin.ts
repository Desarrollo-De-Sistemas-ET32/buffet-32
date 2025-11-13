"use server"

import { connectToDB } from "@/lib/mongodb";
import HomeConfig from "@/models/HomeConfig"
import Page from "@/models/Page";
import User from "@/models/User";
import { cache } from "react";



export async function getUsers(page: number = 1, limit: number = 10, searchQuery?: string) {
  try {
    await connectToDB();

    // Build search filter
    let filter: object = {};
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      filter = {
        $or: [
          { username: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { role: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await User.countDocuments(filter);

    // Get paginated results
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users)),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    };
  }
  catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}


export async function getHomeConfig() {
  try {
    await connectToDB();
    let homeConfig = await HomeConfig.findOne();

    // If no config exists, create a default one
    if (!homeConfig) {
      homeConfig = await HomeConfig.create({
        heroTitle: 'Discover Your Perfect Style',
        heroDescription: 'Explore our curated collection of premium fashion, accessories, and lifestyle products. Elevate your wardrobe with pieces that define your unique style.',
        heroImage: 'https://placehold.co/1920x1080.png',
        heroPrimaryButtonText: 'Shop Now',
        heroSecondaryButtonText: 'Learn More',
        featuredProducts: {
          isEnabled: true,
          title: 'Featured Products',
          layout: 'grid',
          maxProducts: 6,
          autoPlay: true,
          showViewAllButton: true,
          viewAllButtonText: 'View All Products',
        },
        showCategoryBanners: true,
      });
    }

    console.log('Home config:', homeConfig);
    return { success: true, data: JSON.parse(JSON.stringify(homeConfig)) };
  } catch (error) {
    console.error('Error fetching home config:', error);
    return { success: false, error: 'Failed to fetch home config' };
  }
}

type HeroConfigType = {
  _id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroPrimaryButtonText: string;
  heroPrimaryButtonLink: string;
  heroSecondaryButtonText: string;
  heroSecondaryButtonLink: string;
}

type FeaturedProductsConfigType = {
  _id: string;
  featuredProducts: {
    isEnabled: boolean;
    title: string;
    layout: 'grid' | 'carousel';
    maxProducts: number;
    autoPlay: boolean;
    showViewAllButton: boolean;
    viewAllButtonText: string;
  };
}

type HomeConfigType = {
  _id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  featuredProducts: {
    isEnabled: boolean;
    title: string;
    layout: 'grid' | 'carousel';
    maxProducts: number;
    autoPlay: boolean;
    showViewAllButton: boolean;
    viewAllButtonText: string;
  };
  showCategoryBanners: boolean;
  heroPrimaryButtonText: string;
  heroSecondaryButtonText: string;
}

export async function updateHeroConfig(heroConfig: HeroConfigType) {
  try {
    await connectToDB();
    const updatedHomeConfig = await HomeConfig.findByIdAndUpdate(
      heroConfig._id,
      {
        heroTitle: heroConfig.heroTitle,
        heroDescription: heroConfig.heroDescription,
        heroImage: heroConfig.heroImage,
        heroPrimaryButtonText: heroConfig.heroPrimaryButtonText,
        heroPrimaryButtonLink: heroConfig.heroPrimaryButtonLink,
        heroSecondaryButtonText: heroConfig.heroSecondaryButtonText,
        heroSecondaryButtonLink: heroConfig.heroSecondaryButtonLink,
      },
      { new: true }
    );
    return { success: true, data: JSON.parse(JSON.stringify(updatedHomeConfig)) };
  } catch (error) {
    console.error('Error updating hero config:', error);
    return { success: false, error: 'Failed to update hero config' };
  }
}

export async function updateFeaturedProductsConfig(featuredConfig: FeaturedProductsConfigType) {
  try {
    await connectToDB();
    const updatedHomeConfig = await HomeConfig.findByIdAndUpdate(
      featuredConfig._id,
      {
        featuredProducts: featuredConfig.featuredProducts,
      },
      { new: true }
    );
    return { success: true, data: JSON.parse(JSON.stringify(updatedHomeConfig)) };
  } catch (error) {
    console.error('Error updating featured products config:', error);
    return { success: false, error: 'Failed to update featured products config' };
  }
}

export async function updateHomeConfig(homeConfig: HomeConfigType) {
  try {
    await connectToDB();
    const updatedHomeConfig = await HomeConfig.findByIdAndUpdate(homeConfig._id, homeConfig, { new: true });
    return { success: true, data: JSON.parse(JSON.stringify(updatedHomeConfig)) };
  } catch (error) {
    console.error('Error updating home config:', error);
    return { success: false, error: 'Failed to update home config' };
  }
}

export async function getPageBySlug(slug: string) {

  try {
    await connectToDB();
    const page = await Page.findOne({ slug });
    return { success: true, data: JSON.parse(JSON.stringify(page)) };
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return { success: false, error: 'Failed to fetch page by slug' };
  }
}