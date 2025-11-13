"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";
import { useRegisterUser } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
const registerSchema = z.object({
    username: z.string().min(1, "El nombre de usuario es obligatorio").regex(/^[^\s]+$/, "El nombre de usuario no puede tener espacios"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { checkAuthentication } = useAuth();
    const registerUserMutation = useRegisterUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [checkTerms, setCheckTerms] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormData) => {
        if (!checkTerms) {
            toast.error("Debes aceptar los términos de servicio y la política de privacidad");
            return;
        }

        try {
            // Create FormData for the server action
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);

            await registerUserMutation.mutateAsync(formData);
            await checkAuthentication();
            reset();
            setCheckTerms(false);
        } catch (error) {
            // Error handling is done in the mutation
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="bg-oil-900 border-2 border-oil-700 rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-oil-300">
                        Nombre de usuario
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Elige un nombre de usuario"
                        {...register("username")}
                        className={`bg-oil-950 border-oil-700 text-oil-100 placeholder:text-oil-600
                        focus:border-oil-500 focus:ring-1 focus:ring-oil-500 ${
                            errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                    />
                    {errors.username && (
                        <p className="text-xs text-red-400">{errors.username.message}</p>
                    )}
                    <p className="text-xs text-oil-500">El nombre de usuario no puede contener espacios.</p>
                </div>

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
                        focus:border-oil-500 focus:ring-1 focus:ring-oil-500 ${
                            errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-oil-300">
                        Contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Crea una contraseña"
                            {...register("password")}
                            className={`bg-oil-950 border-oil-700 text-oil-100 placeholder:text-oil-600
                            focus:border-oil-500 focus:ring-1 focus:ring-oil-500 pr-10 ${
                                errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-oil-400 hover:text-oil-300"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-oil-500">La contraseña debe tener al menos 8 caracteres</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-oil-300">
                        Confirmar contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirma tu contraseña"
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

                <div className="flex items-start gap-2">
                    <Checkbox
                        id="terms"
                        checked={checkTerms}
                        onCheckedChange={(checked) => setCheckTerms(checked as boolean)}
                        className="mt-1 rounded border-oil-700 bg-oil-950 text-oil-500 
                        focus:ring-oil-500 focus:ring-offset-0"
                    />
                    <Label htmlFor="terms" className="text-sm text-oil-300 cursor-pointer select-none">
                        Acepto los{" "}
                        <Link href="/terms" className="text-oil-400 hover:text-oil-300 underline">
                            Términos de servicio
                        </Link>{" "}
                        y la{" "}
                        <Link href="/privacy" className="text-oil-400 hover:text-oil-300 underline">
                            Política de privacidad
                        </Link>
                    </Label>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting || registerUserMutation.isPending}
                    className="w-full bg-oil-800 hover:bg-oil-700 text-oil-100 border border-oil-600
                    focus:ring-2 focus:ring-oil-500 focus:ring-offset-2 focus:ring-offset-oil-900
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting || registerUserMutation.isPending ? "Registrando..." : "Registrarse"}
                </Button>

                <p className="text-center text-oil-400">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="text-oil-300 hover:text-oil-200 transition-colors">
                        Inicia sesión aquí
                    </Link>
                </p>
            </form>
            <div className="mt-8 text-center">
                <Badge variant="outline" className="bg-oil-900/50 text-oil-400 border-oil-700">
                    Versión Alpha 1.0.0
                </Badge>
            </div>
        </div>
    );
}
