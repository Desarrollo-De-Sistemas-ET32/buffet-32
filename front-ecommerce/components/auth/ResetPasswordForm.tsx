"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La confirmación debe tener al menos 8 caracteres"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (!token) {
            toast.error("Enlace inválido. Solicita un nuevo restablecimiento.");
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Enlace inválido. Solicita un nuevo restablecimiento.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create FormData for the server action
            const formData = new FormData();
            formData.append("token", token);
            formData.append("newPassword", data.newPassword);
            formData.append("confirmPassword", data.confirmPassword);

            const result = await resetPasswordAction(formData);

            if (result.success) {
                toast.success(result.message || "Contraseña restablecida correctamente");
                setIsSuccess(true);
                reset();
            } else {
                toast.error(result.error || "No se pudo restablecer la contraseña");
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg text-center">
                <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-oil-100 mb-2">Enlace de restablecimiento inválido</h2>
                    <p className="text-oil-300 mb-6">
                        Este enlace de restablecimiento es inválido o ha expirado.
                        Solicita un nuevo restablecimiento de contraseña.
                    </p>
                </div>
                
                <Link href="/recover-password">
                    <Button className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600">
                        Solicitar nuevo enlace
                    </Button>
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg text-center">
                <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-oil-100 mb-2">¡Contraseña restablecida!</h2>
                    <p className="text-oil-300 mb-6">
                        Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión con tu nueva contraseña.
                    </p>
                </div>
                
                <Link href="/login">
                    <Button className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600">
                        Ir a iniciar sesión
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-oil-100 mb-2">Restablece tu contraseña</h1>
                <p className="text-oil-300">
                    Ingresa tu nueva contraseña. Procura que sea segura y fácil de recordar.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-oil-300">
                        Nueva contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Ingresa tu nueva contraseña"
                            {...register("newPassword")}
                            className={`bg-oil-950 border-oil-700 text-oil-100 placeholder:text-oil-600
                            focus:border-oil-500 focus:ring-1 focus:ring-oil-500 pr-10 ${
                                errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-oil-400 hover:text-oil-300"
                        >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-xs text-red-400">{errors.newPassword.message}</p>
                    )}
                    <p className="text-xs text-oil-500">La contraseña debe tener al menos 8 caracteres</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-oil-300">
                        Confirmar nueva contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirma tu nueva contraseña"
                            {...register("confirmPassword")}
                            className={`bg-oil-950 border-oil-700 text-oil-100 placeholder:text-oil-600
                            focus:border-oil-500 focus:ring-1 focus:ring-oil-500 pr-10 ${
                                errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-oil-400 hover:text-oil-300"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600
                    focus:ring-2 focus:ring-oil-500 focus:ring-offset-2 focus:ring-offset-oil-900
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Restableciendo contraseña..." : "Restablecer contraseña"}
                </Button>

                <div className="text-center space-y-3">
                    <p className="text-oil-400">
                        ¿Recordaste tu contraseña?{" "}
                        <Link href="/login" className="text-oil-300 hover:text-oil-200 transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                    
                    <p className="text-oil-400">
                        ¿Necesitas un nuevo enlace?{" "}
                        <Link href="/recover-password" className="text-oil-300 hover:text-oil-200 transition-colors">
                            Solicítalo aquí
                        </Link>
                    </p>
                </div>
            </form>

            <div className="mt-8 text-center">
                <Badge variant="outline" className="bg-oil-900/50 text-oil-400 border-oil-700">
                    Versión Alpha 1.0.0
                </Badge>
            </div>
        </div>
    );
}
