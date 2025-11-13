"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRegisterCheckoutUser } from '@/hooks/useUser';
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import FormField from './FormField';
import Spinner from '@/components/ui/spinner';

const registerSchema = z.object({
    username: z.string().min(1, "El nombre de usuario es obligatorio").regex(/^[^\s]+$/, "El nombre de usuario no puede contener espacios"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    phone: z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
    dni: z.string().min(1, 'ID number is required'),
    course: z.string().min(1, 'Course is required'),
    division: z.string().min(1, 'Division is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const NoUserCheckoutForm = () => {
    const registerCheckoutUserMutation = useRegisterCheckoutUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const onSubmit = useCallback(async (data: RegisterFormData) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("phone", data.phone);
        formData.append("dni", data.dni);
        formData.append("course", data.course);
        formData.append("division", data.division);

        registerCheckoutUserMutation.registerCheckoutUser(formData, {
            onSuccess: () => {
                reset();
                toast.success('¡Cuenta creada con éxito!');
            },
            onError: (error) => {
                console.log(error);
                toast.error('No se pudo crear la cuenta. Inténtalo de nuevo.');
            }
        });
    }, [registerCheckoutUserMutation, reset]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const isFormSubmitting = isSubmitting || registerCheckoutUserMutation.isPending;

    return (
        <Card className="flex-1 min-w-[320px] max-w-lg flex flex-col">
            <CardHeader>
                <CardTitle>Envío y pago</CardTitle>
                <div className="mt-2 font-medium text-base">Información de envío</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <form 
                    className="flex flex-col gap-3" 
                    onSubmit={handleSubmit(onSubmit)}
                    aria-label="Formulario de registro"
                >
                    <FormField
                        label="Nombre de usuario"
                        id="username"
                        register={register("username")}
                        error={errors.username}
                        placeholder="Nombre de usuario"
                    />
                    <div className="text-xs text-muted-foreground -mt-2">
                        El nombre de usuario no puede contener espacios.
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label htmlFor="password" className="mb-1 block text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Contraseña"
                                    {...register("password")}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${
                                        errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                    aria-describedby={errors.password ? "password-error" : undefined}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/80"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <span 
                                    id="password-error"
                                    className="text-red-500 text-sm mt-1 block"
                                    role="alert"
                                >
                                    {errors.password.message}
                                </span>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                La contraseña debe tener al menos 8 caracteres
                            </p>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    {...register("confirmPassword")}
                                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${
                                        errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/80"
                                    aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span 
                                    id="confirmPassword-error"
                                    className="text-red-500 text-sm mt-1 block"
                                    role="alert"
                                >
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <FormField
                            label="Nombre"
                            id="firstName"
                            register={register("firstName")}
                            error={errors.firstName}
                            placeholder="Nombre"
                            className="flex-1"
                        />
                        <FormField
                            label="Apellido"
                            id="lastName"
                            register={register("lastName")}
                            error={errors.lastName}
                            placeholder="Apellido"
                            className="flex-1"
                        />
                    </div>

                    <FormField
                        label="Correo electrónico"
                        id="email"
                        register={register("email")}
                        error={errors.email}
                        type="email"
                        placeholder="Correo electrónico"
                    />

                    <FormField
                        label="Teléfono"
                        id="phone"
                        register={register("phone")}
                        error={errors.phone}
                        type="tel"
                        placeholder="Teléfono"
                    />

                    <FormField
                        label="ID Number (DNI)"
                        id="dni"
                        register={register("dni")}
                        error={errors.dni}
                        placeholder="Enter your ID number"
                    />

                    <div className="flex gap-3">
                        <FormField
                            label="Course"
                            id="course"
                            register={register("course")}
                            error={errors.course}
                            placeholder="Enter course"
                            className="flex-1"
                        />
                        <FormField
                            label="Division"
                            id="division"
                            register={register("division")}
                            error={errors.division}
                            placeholder="Enter division"
                            className="flex-1"
                        />
                    </div>

                    <Button
                        className="w-full mt-4 text-base font-semibold rounded-full"
                        size="lg"
                        type="submit"
                        disabled={isFormSubmitting}
                    >
                        {isFormSubmitting && (
                            <Spinner size="sm" className="mr-2" />
                        )}
                        {isFormSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default NoUserCheckoutForm;
