import { useCoupons } from '@/hooks/useCoupon';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import SkeletonTable from './SkeletonTable';
import CreateCouponForm from './CreateCouponForm';
import { Coupon } from '@/types/coupon';

const AdminCoupons = () => {

  const { data: coupons, isLoading, error } = useCoupons();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className='flex flex-col gap-2'>
          <CardTitle>Cupones</CardTitle>
          <CardDescription>Gestiona tus cupones</CardDescription>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4" />
              Crear Cupón
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[90vh] min-w-full lg:min-w-5xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Crear Cupón</DialogTitle>
              <DialogClose className="absolute right-4 top-4" />
            </DialogHeader>
            <CreateCouponForm onCreated={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonTable columns={6} rows={3} />

        ) : error ? (
          <div className="flex justify-center items-center p-8 text-destructive">Error al cargar cupones</div>
        ) : !coupons || coupons.data.length === 0 ? (
          <div className="flex justify-center items-center p-4 text-muted-foreground">No se encontraron cupones</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Usos Máximos</TableHead>
                <TableHead>Expira el</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.data.map((coupon: Coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.type}</TableCell>
                  <TableCell>{coupon.value}{coupon.type === 'percentage' ? '%' : '$'}</TableCell>
                  <TableCell>{coupon.maxUses}</TableCell>
                  <TableCell>{coupon.expiresAt}</TableCell>
                  <TableCell className='text-right flex gap-2 justify-end'>
                    actions
                    {/* <EditCategoryDialog category={category} onUpdated={() => { }} />
                        <DeleteCategoryDialog categoryId={category._id} onConfirm={() => { }} /> */}
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

export default AdminCoupons