'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateCoupon } from '@/hooks/useCoupon';
import { Input } from '@/components/ui/input';
import { Plus, Percent, DollarSign, Users, Tag, Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

const couponSchema = z.object({
  code: z.string().min(1, 'El código del cupón es obligatorio').max(20, 'El código del cupón debe tener menos de 20 caracteres'),
  description: z.string().default(''),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0.01, 'El valor debe ser mayor que 0').max(10000, 'El valor no puede exceder 10000'),
  maxUses: z.number().min(1, 'Los usos máximos deben ser al menos 1').max(10000, 'Los usos máximos no pueden exceder 10000'),
  expiresAt: z.date({
    message: "La fecha de expiración es obligatoria",
  }),
}).refine((data) => {
  if (data.type === 'percentage' && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: "El descuento porcentual no puede exceder el 100%",
  path: ["value"],
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CreateCouponFormProps {
  onCreated: () => void;
}

const CreateCouponForm = ({ onCreated }: CreateCouponFormProps) => {
  const createCouponMutation = useCreateCoupon();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      type: 'percentage' as const,
      maxUses: 1,
      description: '',
    },
  });

  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const selectedType = watch('type');

  const onSubmit = async (data: CouponFormData) => {
    try {
      const couponData = {
        ...data,
        description: data.description || '',
        expiresAt: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
      };
      await createCouponMutation.mutateAsync(couponData);
      reset();
      setSelectedDate(undefined);
      if (onCreated) onCreated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overflow-y-auto">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Crear Cupón</h2>
            <p className="text-sm text-muted-foreground">
              Crea un nuevo cupón de descuento para tus clientes
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="pt-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Código del Cupón
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Tag className="w-4 h-4" />
                  </span>
                  <Input
                    id="code"
                    {...register('code')}
                    placeholder="Introduce el código del cupón"
                    className={`h-10 pl-10 ${errors.code ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.code && (
                  <p className="text-xs text-red-500">{errors.code.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de Descuento</Label>
                <RadioGroup
                  value={selectedType}
                  onValueChange={(value) => setValue('type', value as 'percentage' | 'fixed')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="text-sm font-medium cursor-pointer">
                      Porcentaje (%)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="text-sm font-medium cursor-pointer">
                      Monto Fijo ($)
                    </Label>
                  </div>
                </RadioGroup>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción (Opcional)
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Introduce la descripción del cupón"
                className={`min-h-[80px] resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Discount & Usage Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Descuento y Uso
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium">
                  {selectedType === 'percentage' ? 'Porcentaje de Descuento' : 'Monto de Descuento'}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    {selectedType === 'percentage' ? (
                      <Percent className="w-4 h-4" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                  </span>
                  <Input
                    id="value"
                    type="number"
                    step={selectedType === 'percentage' ? '1' : '0.01'}
                    {...register('value', { valueAsNumber: true })}
                    placeholder={selectedType === 'percentage' ? '15' : '10.50'}
                    className={`h-10 pl-10 ${errors.value ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.value && (
                  <p className="text-xs text-red-500">{errors.value.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUses" className="text-sm font-medium">
                  Usos Máximos
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                  </span>
                  <Input
                    id="maxUses"
                    type="number"
                    step="1"
                    {...register('maxUses', { valueAsNumber: true })}
                    placeholder="100"
                    className={`h-10 pl-10 ${errors.maxUses ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.maxUses && (
                  <p className="text-xs text-red-500">{errors.maxUses.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="text-sm font-medium">
                  Fecha de Expiración
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={(date) => {
                      setSelectedDate(date);
                      setValue('expiresAt', date || new Date(), { shouldValidate: true });
                    }}
                    placeholder="Seleccionar fecha de expiración"
                    className={`h-10 !pl-10 bg-red-500 ${errors.expiresAt ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.expiresAt && (
                  <p className="text-xs text-red-500">{errors.expiresAt.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full font-medium"
              disabled={createCouponMutation.isPending}
            >
              {createCouponMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando Cupón...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Cupón
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCouponForm;