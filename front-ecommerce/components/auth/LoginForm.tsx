"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";
import { useLoginUser } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    emailOrUsername: z.string().min(1, "El correo o nombre de usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { checkAuthentication } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const loginUserMutation = useLoginUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setValue('emailOrUsername', savedUsername);
            setRememberMe(true);
        }
    }, [setValue]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            if (rememberMe) {
                localStorage.setItem('username', data.emailOrUsername);
            } else {
                localStorage.removeItem('username');
            }

            const formData = new FormData();
            formData.append("emailOrUsername", data.emailOrUsername);
            formData.append("password", data.password);

            await loginUserMutation.mutateAsync(formData);
            await checkAuthentication();
            reset();
        } catch (error) {
            // Error handling is done in the mutation
            console.error("Login error:", error);
        }
    };

    return (
        <div className="bg-card border-2 border-border rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email/Username field */}
                <div className="space-y-2">
                    <label htmlFor="emailOrUsername" className="text-sm font-medium text-foreground">
                        Correo o usuario
                    </label>
                    <Input
                        id="emailOrUsername"
                        type="text"
                        placeholder="Ingresa tu correo o usuario"
                        {...register("emailOrUsername")}
                        className={`bg-background border-input text-foreground placeholder:text-muted-foreground
                        focus:border-ring focus:ring-1 focus:ring-ring ${errors.emailOrUsername ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                            }`}
                    />
                    {errors.emailOrUsername && (
                        <p className="text-xs text-red-400">{errors.emailOrUsername.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
                            {...register("password")}
                            className={`bg-background border-input text-foreground
                            focus:ring-1 pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label htmlFor="remember" className="text-sm text-foreground">
                            Recuérdame
                        </label>
                    </div>
                    <Link
                        href="/recover-password"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting || loginUserMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border border-input
                    focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting || loginUserMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>

                <p className="text-center text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-foreground hover:text-foreground/80 transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
                <Link href="/" className="text-muted-foreground text-center block underline hover:text-foreground transition-colors">
                    Entrar como invitado
                </Link>

            </form>
            <div className="mt-8 text-center">
                <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                    Versión Alpha 1.0.0
                </Badge>
            </div>
        </div>
    );
}

export default LoginForm;
