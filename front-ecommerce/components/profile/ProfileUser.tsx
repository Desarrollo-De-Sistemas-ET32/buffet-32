import { useUser, useUpdateUser, useUserWithCounts } from '@/hooks/useUser';
import { useAuth } from '@/context/auth-context';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import FormField from '@/components/checkout/FormField';
import Spinner from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

const formSchema = z.object({
    firstName: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'El apellido es obligatorio'),
    phone: z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
    email: z.string().email('Correo electrónico inválido'),
    dni: z.string().min(1, 'ID number is required'),
    course: z.string().min(1, 'Course is required'),
    division: z.string().min(1, 'Division is required'),
});

type FormData = z.infer<typeof formSchema>;

const ProfileUser = () => {
    const { isAuthenticated, userId } = useAuth();
    const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
    const { data: userWithCounts, isLoading: isLoadingCounts } = useUserWithCounts();
    const updateUserMutation = useUpdateUser();

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
        if (!user?.data) return null;

        return {
            firstName: user.data.firstName || '',
            lastName: user.data.lastName || '',
            phone: user.data.phone || '',
            email: user.data.email || '',
            dni: user.data.dni || '',
            course: user.data.course || '',
            division: user.data.division || '',
        };
    }, [user]);

    // Reset form when user data changes
    useEffect(() => {
        if (userFormData) {
            reset(userFormData);
        }
    }, [userFormData, reset]);

    const onSubmit = async (data: FormData) => {
        await updateUserMutation.updateUser(data);
    };

    // Show loading if user is authenticated but profile data is still loading
    if (isAuthenticated && isLoadingUser) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Información personal</h2>
                <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Cargando perfil...</span>
                </div>
            </div>
        );
    }

    // Show loading if not authenticated yet (auth check in progress)
    if (!isAuthenticated && userId === null) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Información personal</h2>
                <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Verificando autenticación...</span>
                </div>
            </div>
        );
    }

    // Show error if authenticated but there's an error loading profile
    if (isAuthenticated && userError) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Información personal</h2>
                <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
                <div className="text-center py-8">
                    <p className="text-destructive">Error al cargar el perfil: {userError.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    // Show message if not authenticated
    if (!isAuthenticated) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Información personal</h2>
                <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    // Show message if no profile data available
    if (!user?.data) {
        return (
            <div>
                <h2 className='text-2xl font-bold'>Información personal</h2>
                <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay datos de perfil disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className='text-2xl font-bold'>Información personal</h2>
            <p className="text-muted-foreground">Administra los datos de tu cuenta y revisa tus pedidos</p>
            <div className='grid grid-cols-12 gap-4'>
                <Card className="mt-6 col-span-12 md:col-span-4">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">
                            {userFormData?.firstName} {userFormData?.lastName}
                        </CardTitle>
                        <CardDescription>{userFormData?.email}</CardDescription>
                        <Badge variant="secondary" className="w-fit mx-auto mt-2">
                            <Shield className="h-3 w-3 mr-1" />
                            Cuenta verificada
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{userFormData?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{userFormData?.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>
                                DNI: {userFormData?.dni || '—'} • Course: {userFormData?.course || '—'} • Division: {userFormData?.division || '—'}
                            </span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                {isLoadingCounts ? (
                                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                                ) : (
                                    <div className="text-2xl font-bold">{userWithCounts?.data?.ordersCount || 0}</div>
                                )}
                                <div className="text-xs text-muted-foreground">Pedidos</div>
                            </div>
                            <div>
                                {isLoadingCounts ? (
                                    <Skeleton className="h-8 w-8 mx-auto mb-1" />
                                ) : (
                                    <div className="text-2xl font-bold">{userWithCounts?.data?.wishlistCount || 0}</div>
                                )}
                                <div className="text-xs text-muted-foreground">Favoritos</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="mt-6 col-span-12 md:col-span-8">
                    <CardHeader>
                        <CardTitle>Editar información del perfil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <div className="flex gap-3">
                               <FormField
                                    label="Nombre"
                                    id="firstName"
                                    register={register('firstName')}
                                    error={errors.firstName}
                                    placeholder="Nombre"
                                    className="flex-1"
                                />
                                <FormField
                                    label="Apellido"
                                    id="lastName"
                                    register={register('lastName')}
                                    error={errors.lastName}
                                    placeholder="Apellido"
                                    className="flex-1"
                                />
                            </div>

                            <FormField
                                label="Correo electrónico"
                                id="email"
                                register={register('email')}
                                error={errors.email}
                                disabled={true}
                                type="email"
                                placeholder="Correo electrónico"
                            />

                            <FormField
                                label="Teléfono"
                                id="phone"
                                register={register('phone')}
                                error={errors.phone}
                                type="tel"
                                placeholder="Teléfono"
                            />

                            <FormField
                                label="ID Number (DNI)"
                                id="dni"
                                register={register('dni')}
                                error={errors.dni}
                                placeholder="Enter your ID number"
                            />

                            <div className="flex gap-3">
                                <FormField
                                    label="Course"
                                    id="course"
                                    register={register('course')}
                                    error={errors.course}
                                    placeholder="Enter course"
                                    className="flex-1"
                                />
                                <FormField
                                    label="Division"
                                    id="division"
                                    register={register('division')}
                                    error={errors.division}
                                    placeholder="Enter division"
                                    className="flex-1"
                                />
                            </div>

                            <Button
                                className="w-full mt-4 text-base font-semibold rounded-full"
                                size="lg"
                                type="submit"
                                disabled={updateUserMutation.isPending}
                            >
                                {updateUserMutation.isPending && (
                                    <Spinner size="sm" className="mr-2" />
                                )}
                                {updateUserMutation.isPending ? 'Actualizando...' : 'Actualizar perfil'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfileUser;
