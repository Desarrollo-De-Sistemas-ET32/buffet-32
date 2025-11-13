'use client';

import { useProducts, useDeleteProduct, useUpdateProduct } from '../../hooks/useProducts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import EditProductForm, { ProductFormData } from './EditProductForm';
import { Pencil, Trash, Plus, Star, Search } from 'lucide-react';
import CreateProductForm from './CreateProductForm';
import SkeletonTable from './SkeletonTable';
import { Badge } from '../ui/badge';
import { useDebounce } from '../../hooks/useDebounce';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function DeleteProductDialog({ productId, onConfirm }: { productId: string, onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Producto</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteProduct.mutateAsync(productId);
              setOpen(false);
              onConfirm();
            }}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({ product, onConfirm }: { product: Product, onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  const updateProduct = useUpdateProduct();
  const initialValues: ProductFormData = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category._id,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    stock: product.stock,
    discount: product.discount,
    images: product.images || [],
  };
  const handleEdit = async (data: ProductFormData) => {
    updateProduct.mutate({ productId: product._id, data }, {
      onSuccess: () => {
        setOpen(false);
        onConfirm();
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className='!p-2 lg:!p-6 xl:min-w-7xl lg:min-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='hidden'>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <EditProductForm
          initialValues={initialValues}
          onSubmit={handleEdit}
          loading={updateProduct.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const { data: productsData, isLoading, error } = useProducts(currentPage, itemsPerPage, debouncedSearchQuery);

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;

    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('ellipsis-start');
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis-end');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Gestiona tu inventario de productos
            {pagination && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({pagination.totalCount} productos en total)
              </span>
            )}
          </CardDescription>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4" />
              Crear Producto
            </Button>
          </DialogTrigger>
          <DialogContent className='!p-2 lg:!p-6 xl:min-w-7xl lg:min-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <DialogHeader className='hidden'>
              <DialogTitle>Crear Producto</DialogTitle>
              <DialogClose className="absolute right-4 top-4" />
            </DialogHeader>
            <CreateProductForm onCreated={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos por nombre..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable columns={6} rows={8} />
        ) : error ? (
          <div className="flex justify-center items-center p-8 text-destructive">
            <span>Error al cargar productos: {error.message}</span>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex justify-center items-center p-8 text-muted-foreground">
            <span>
              {searchQuery
                ? `No se encontraron productos que coincidan con "${searchQuery}"`
                : 'No se encontraron productos'
              }
            </span>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Existencias</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Destacado</TableHead>
                  <TableHead>Creado el</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {product.description}
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.isActive ? <Badge variant="success">Activo</Badge> : <Badge variant="error">Inactivo</Badge>}</TableCell>
                    <TableCell>
                      {product.isFeatured ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Destacado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Destacado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      <EditProductDialog product={product} onConfirm={() => setRefresh(r => r + 1)} />
                      <DeleteProductDialog productId={product._id} onConfirm={() => setRefresh(r => r + 1)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 space-y-4">
                <Pagination className=''>
                  <PaginationContent className=''>
                    <PaginationItem className=''>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {renderPageNumbers()?.map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center text-sm text-muted-foreground">
                  Página {currentPage} de {pagination.totalPages} •
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalCount)} de {pagination.totalCount} productos
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 