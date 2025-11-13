"use client"
import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/useUser';
import { Edit } from 'lucide-react';
import NoUserCheckoutForm from './NoUserCheckoutForm';
import FormField from './FormField';
import Spinner from '@/components/ui/spinner';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  phone: z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
  email: z.email('Correo electrónico inválido'),
  dni: z.string().min(1, 'ID number is required'),
  course: z.string().min(1, 'Course is required'),
  division: z.string().min(1, 'Division is required'),
});

type FormData = z.infer<typeof formSchema>;

type User = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  course: string;
  division: string;
}

interface CheckoutFormProps {
  onPayment: (formData: FormData) => Promise<void>;
  user: User | null;
  itemsLength: number;
  paymentMethod: 'mercadopago' | 'cash';
  onPaymentMethodChange: (value: 'mercadopago' | 'cash') => void;
  isSubmitting: boolean;
}

const CheckoutForm = ({ onPayment, user, itemsLength, paymentMethod, onPaymentMethodChange, isSubmitting }: CheckoutFormProps) => {
  const updateUserMutation = useUpdateUser();
  const [isEditing, setIsEditing] = React.useState(false);

  // Store original values to restore on cancel
  const originalValuesRef = useRef<FormData | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dni: '',
      course: '',
      division: '',
    },
  });

  // Memoize user data to prevent unnecessary re-renders
  const userFormData = useMemo(() => {
    if (!user) return null;

    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      email: user.email || '',
      dni: user.dni || '',
      course: user.course || '',
      division: user.division || '',
    };
  }, [user]);

  // Optimized useEffect with useCallback to prevent unnecessary re-renders
  const resetForm = useCallback((data: FormData) => {
    reset(data);
  }, [reset]);

  useEffect(() => {
    if (userFormData) {
      resetForm(userFormData);
      // Store original values when user data is first loaded
      if (!originalValuesRef.current) {
        originalValuesRef.current = { ...userFormData };
      }
    }
  }, [userFormData, resetForm]);

  const onSubmit = async (data: FormData) => {
    await onPayment(data);
  };

  const onSubmitEdit = async (data: FormData) => {
    try {
      await updateUserMutation.updateUser(data);
      setIsEditing(false);
      originalValuesRef.current = { ...data };
    } catch (error) {
      toast.error('No se pudo actualizar la información');
    }
  };

  const toggleEdit = useCallback(() => {
    if (isEditing) {
      if (originalValuesRef.current) {
        reset(originalValuesRef.current);
      }
      setIsEditing(false);
      toast.info('Cambios descartados');
    } else {
      const currentValues = {
        firstName: userFormData?.firstName || '',
        lastName: userFormData?.lastName || '',
        phone: userFormData?.phone || '',
        email: userFormData?.email || '',
        dni: userFormData?.dni || '',
        course: userFormData?.course || '',
        division: userFormData?.division || '',
      };
      originalValuesRef.current = { ...currentValues };
      setIsEditing(true);
    }
  }, [isEditing, reset, userFormData]);

  // if (!user) return <NoUserCheckoutForm />;

  const paymentButtonLabel = paymentMethod === 'cash' ? 'Confirmar pedido' : 'Proceder al pago';

  const buttonText = isEditing
    ? (updateUserMutation.isPending ? 'Actualizando...' : 'Actualizar información')
    : (isSubmitting ? 'Procesando...' : itemsLength > 0 ? paymentButtonLabel : 'Agrega productos al carrito');

  return (
    <Card className="flex-1 min-w-[320px] max-w-lg flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Envío y pago</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEdit}
            className="flex items-center gap-2"
            aria-label={isEditing ? 'Cancelar edición de información' : 'Editar información de envío'}
          >
            <Edit className="w-4 h-4" />
            {isEditing ? 'Cancelar' : 'Editar información'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <form
          onSubmit={handleSubmit(isEditing ? onSubmitEdit : onSubmit)}
          className="flex flex-col gap-3"
          aria-label="Formulario de pago"
        >
          <div className="flex gap-3">
            <FormField
              label="Nombre"
              id="firstName"
              register={register('firstName')}
              error={errors.firstName}
              disabled={!isEditing}
              placeholder="Nombre"
              className="flex-1"
            />
            <FormField
              label="Apellido"
              id="lastName"
              register={register('lastName')}
              error={errors.lastName}
              disabled={!isEditing}
              placeholder="Apellido"
              className="flex-1"
            />
          </div>

          <FormField
            label="Correo electrónico"
            id="email"
            register={register('email')}
            error={errors.email}
            disabled={!isEditing}
            type="email"
            placeholder="Correo electrónico"
          />

          <FormField
            label="Teléfono"
            id="phone"
            register={register('phone')}
            error={errors.phone}
            disabled={!isEditing}
            type="tel"
            placeholder="Teléfono"
          />

          <FormField
            label="ID Number (DNI)"
            id="dni"
            register={register('dni')}
            error={errors.dni}
            disabled={!isEditing}
            placeholder="Enter your ID number"
          />

          <div className="flex gap-3">
            <FormField
              label="Course"
              id="course"
              register={register('course')}
              error={errors.course}
              disabled={!isEditing}
              placeholder="Enter course"
              className="flex-1"
            />
            <FormField
              label="Division"
              id="division"
              register={register('division')}
              error={errors.division}
              disabled={!isEditing}
              placeholder="Enter division"
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Método de pago</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => onPaymentMethodChange(value as 'mercadopago' | 'cash')}
              className="grid gap-4"
            >
              <Label
                htmlFor="mercadopago"
                className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:border-primary"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="mercadopago" value="mercadopago" className="h-4 w-4" />
                  <div>
                    <span className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Mercado Pago
                    </span>
                    <p className="text-xs text-muted-foreground">Paga online de forma segura</p>
                  </div>
                </div>
              </Label>
              <Label
                htmlFor="cash"
                className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:border-primary"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="cash" value="cash" className="h-4 w-4" />
                  <div>
                    <span className="font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> Efectivo
                    </span>
                    <p className="text-xs text-muted-foreground">Abonas en el colegio o punto acordado</p>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <Button
            className="w-full mt-4 text-base font-semibold rounded-full"
            size="lg"
            type="submit"
            disabled={updateUserMutation.isPending || itemsLength === 0 || isSubmitting}
          >
            {updateUserMutation.isPending && (
              <Spinner size="sm" className="mr-2" />
            )}
            {isSubmitting && !isEditing && !updateUserMutation.isPending && (
              <Spinner size="sm" className="mr-2" />
            )}
            {buttonText}
          </Button>
          {
            itemsLength === 0 && (
              <Link href="/products" className="text-sm text-center underline transition-opacity text-muted-foreground">
                Agrega productos al carrito para continuar
              </Link>
            )
          }

        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
