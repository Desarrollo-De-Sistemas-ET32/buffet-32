"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requestPasswordResetAction } from "@/actions/auth";

const recoverPasswordSchema = z.object({
    email: z.email("Correo electrónico inválido"),
});

type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;

export function RecoverPasswordForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RecoverPasswordFormData>({
        resolver: zodResolver(recoverPasswordSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: RecoverPasswordFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("email", data.email);

            const result = await requestPasswordResetAction(formData);

            if (result.success) {
                toast.success(result.message || "Correo de restablecimiento enviado correctamente");
                setIsEmailSent(true);
                reset();
            } else {
                toast.error(result.error || "No se pudo enviar el correo de restablecimiento");
            }
        } catch (error) {
            console.error("Password recovery error:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg text-center">
                <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-oil-100 mb-2">Revisa tu correo</h2>
                    <p className="text-oil-300 mb-4">
                        Te enviamos un enlace para restablecer tu contraseña.
                        Revisa tu bandeja de entrada y sigue las instrucciones.
                    </p>
                    <p className="text-oil-400 text-sm mb-6">
                        El enlace expirará en 1 hora por seguridad.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => setIsEmailSent(false)}
                        className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600"
                    >
                        Enviar otro correo
                    </Button>

                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="w-full border-oil-600 text-oil-300 hover:bg-oil-800"
                        >
                            Volver a iniciar sesión
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-oil-100 mb-2">¿Olvidaste tu contraseña?</h1>
                <p className="text-oil-300">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-oil-300">
                        Correo electrónico
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        {...register("email")}
                        className={`bg-oil-950 border-oil-700 text-oil-100 placeholder:text-oil-600
                        focus:border-oil-500 focus:ring-1 focus:ring-oil-500 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600
                    focus:ring-2 focus:ring-oil-500 focus:ring-offset-2 focus:ring-offset-oil-900
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Enviando..." : "Enviar enlace"}
                </Button>

                <div className="text-center space-y-3">
                    <p className="text-oil-400">
                        ¿Recordaste tu contraseña?{" "}
                        <Link href="/login" className="text-oil-300 hover:text-oil-200 transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>

                    <p className="text-oil-400">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/register" className="text-oil-300 hover:text-oil-200 transition-colors">
                            Regístrate aquí
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
