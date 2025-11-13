"use client";

import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/auth-context";
import { changePasswordAction } from "@/actions/auth";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ProfileSettings = () => {
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create FormData for the server action
            const formData = new FormData();
            formData.append("currentPassword", data.currentPassword);
            formData.append("newPassword", data.newPassword);
            formData.append("confirmNewPassword", data.confirmNewPassword);
            formData.append("userId", user.id);

            const result = await changePasswordAction(formData);

            if (result.success) {
                toast.success(result.message || "Password changed successfully");
                reset();
            } else {
                toast.error(result.error || "Failed to change password");
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className='text-2xl font-bold'>Settings</h2>
                <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                {...register("currentPassword")}
                                className={`pr-10 ${
                                    errors.currentPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                {...register("newPassword")}
                                className={`pr-10 ${
                                    errors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword" className="text-sm font-medium">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmNewPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                {...register("confirmNewPassword")}
                                className={`pr-10 ${
                                    errors.confirmNewPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmNewPassword && (
                            <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Changing Password..." : "Change Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;