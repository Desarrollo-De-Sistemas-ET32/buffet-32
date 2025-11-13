import { getUserAction, updateUserAction, registerCheckoutUserAction, getUserProfileAction, getUserWithOrdersAndWishlistCounts } from "@/actions/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export const useUser = () => {
    const { userId, isAuthenticated } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserAction(userId as string),
        enabled: !!userId && isAuthenticated,
        retry: 2,
        retryDelay: 1000,
    });
    console.log(data);
    return { data, isLoading, error };
}

export const useUserProfile = () => {
    const { userId, isAuthenticated } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => getUserProfileAction(userId as string),
        enabled: !!userId && isAuthenticated,
        // retry: 2,
        // retryDelay: 1000,
    });
    console.log(data, 'userProfile');
    return { data, isLoading, error };
}

export const useRegisterCheckoutUser = () => {
    const { checkAuthentication } = useAuth();
    const { mutate: registerCheckoutUser, isPending } = useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await registerCheckoutUserAction(formData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: async () => {
            toast.success("User created successfully");
            await checkAuthentication();
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create user");
        },
    });
    return { registerCheckoutUser, isPending };
}

export const useUpdateUser = () => {
    const { userId } = useAuth();
    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: (formData: {
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
            dni: string;
            course: string;
            division: string;
        }) => updateUserAction(userId as string, formData),
        onSuccess: () => {
            toast.success("User updated successfully");
        },
        onError: () => {
            toast.error("Failed to update user");
        },
    });
    return { updateUser, isPending };
}

export const useUserWithCounts = () => {
    const { userId, isAuthenticated } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['userWithCounts', userId],
        queryFn: () => getUserWithOrdersAndWishlistCounts(userId as string),
        enabled: !!userId && isAuthenticated,
        retry: 2,
        retryDelay: 1000,
    });
    return { data, isLoading, error };
}
