'use client';

import { useUsers } from '../../hooks/useUsers';
import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonTable from './SkeletonTable';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  phone?: string;
  dni?: string;
  course?: string;
  division?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const { data: usersResponse, isLoading, error } = useUsers(currentPage, itemsPerPage, debouncedSearchQuery);

  const users = usersResponse?.success ? usersResponse.data : [];
  const pagination = usersResponse?.pagination;

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Ver todos los usuarios registrados
            {pagination && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({pagination.totalCount} usuarios en total)
              </span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuarios por nombre de usuario, email, nombre o rol..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable columns={7} rows={8} />
        ) : error ? (
          <div className="flex justify-center items-center p-8 text-destructive">
            <span>Error al cargar usuarios: {error.message}</span>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="flex justify-center items-center p-8 text-muted-foreground">
            <span>
              {searchQuery
                ? `No se encontraron usuarios que coincidan con "${searchQuery}"`
                : 'No se encontraron usuarios'
              }
            </span>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre de usuario</TableHead>
                  <TableHead>Correo electrónico</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Información del Estudiante</TableHead>
                  <TableHead>Se unió el</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.firstName || user.lastName ? (
                        `${user.firstName || ''} ${user.lastName || ''}`.trim()
                      ) : (
                        <span className="text-muted-foreground">No proporcionado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.phone || (
                        <span className="text-muted-foreground">No proporcionado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.dni || user.course || user.division ? (
                        <div className="space-y-1">
                          <div className="text-sm">DNI: {user.dni || '—'}</div>
                          <div className="text-xs text-muted-foreground">Curso: {user.course || '—'} • División: {user.division || '—'}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No proporcionado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalCount)} de {pagination.totalCount} usuarios
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
