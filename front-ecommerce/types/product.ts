export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    category: Category;
    stock: number;
    discount: number;
    isWishlisted?: boolean;
}

export interface ProductOrder {
    product: Product;
    quantity: number;
}

export interface ActionResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ProductsActionResult extends ActionResult<Product[]> {
    data: Product[];
    pagination?: PaginationInfo;
}

export interface ProductsSearchActionResult extends ActionResult<Product[]> {
    data: Product[];
    hasMore?: boolean;
}
