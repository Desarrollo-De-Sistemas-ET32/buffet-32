import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Pencil, Trash, Plus } from 'lucide-react';
import CreateCategoryForm from './CreateCategoryForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { useCategories, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategory';
import React, { useEffect, useState } from 'react';
import SkeletonTable from './SkeletonTable';

const AdminCategory = () => {
    const { data: categories, isLoading, error } = useCategories();
    const [createOpen, setCreateOpen] = useState(false);

    // Ensure categories is always an array
    const categoriesArray = Array.isArray(categories) ? categories : [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Categorías</CardTitle>
                    <CardDescription>Gestiona tus categorías de productos</CardDescription>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" onClick={() => setCreateOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Crear Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Categoría</DialogTitle>
                            <DialogClose className="absolute right-4 top-4" />
                        </DialogHeader>
                        <CreateCategoryForm onCreated={() => setCreateOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <SkeletonTable columns={2} rows={3} />
                ) : error ? (
                    <div className="flex justify-center items-center p-8 text-destructive">Error al cargar categorías</div>
                ) : categoriesArray.length === 0 ? (
                    <div className="flex justify-center items-center p-4 text-muted-foreground">No se encontraron categorías</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead className='text-right'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categoriesArray.map(category => (
                                <TableRow key={category._id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell className='text-right flex gap-2 justify-end'>
                                        <EditCategoryDialog category={category} onUpdated={() => { }} />
                                        <DeleteCategoryDialog categoryId={category._id} onConfirm={() => { }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}

function EditCategoryDialog({ category, onUpdated }: { category: { _id: string, name: string }, onUpdated: () => void }) {
    const [open, setOpen] = useState(false);
    const updateCategoryMutation = useUpdateCategory();
    const [name, setName] = useState(category.name);
    useEffect(() => {
        if (open) setName(category.name);
    }, [open, category.name]);
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCategoryMutation.mutateAsync({ categoryId: category._id, data: { name } });
        setOpen(false);
        onUpdated();
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Categoría</DialogTitle>
                    <DialogClose className="absolute right-4 top-4" />
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        autoFocus
                        autoComplete="off"
                        placeholder="Nombre de la categoría"
                    />
                    <Button type="submit" className="w-full" disabled={updateCategoryMutation.isPending}>
                        {updateCategoryMutation.isPending ? 'Guardando...' : 'Guardar'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteCategoryDialog({ categoryId, onConfirm }: { categoryId: string, onConfirm: () => void }) {
    const [open, setOpen] = useState(false);
    const deleteCategory = useDeleteCategory();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="p-2">
                    <Trash className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Categoría</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await deleteCategory.mutateAsync(categoryId);
                            setOpen(false);
                            onConfirm();
                        }}
                        disabled={deleteCategory.isPending}
                    >
                        {deleteCategory.isPending ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AdminCategory