import { registerUserAction, loginUserAction, logoutUserAction } from "@/actions/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useRegisterUser = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: registerUserAction,
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Account created successfully!");
                router.push("/");
            } else {
                toast.error(data.error || "Failed to create account");
            }
        },
        onError: (error) => {
            console.error("Registration mutation error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        },
    });
};

export const useLoginUser = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: loginUserAction,
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Welcome back!");
                router.push("/");
            } else {
                toast.error(data.error || "Failed to login");
            }
        },
        onError: (error) => {
            console.error("Login mutation error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        },
    });
};

export const useLogoutUser = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: logoutUserAction,
        onSuccess: (data) => {
            if (data.success) {
                toast.success("You've been successfully logged out.");
                router.push("/");
            } else {
                toast.error(data.error || "Failed to logout");
            }
        },
        onError: (error) => {
            console.error("Logout mutation error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        },
    });
};

