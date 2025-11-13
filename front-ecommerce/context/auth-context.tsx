"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { checkSession } from '@/lib/session';
import { logoutUserAction } from '@/actions/auth';

type User = {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
} | null;

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    user: User;
    isLoading: boolean;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
    hasRole: (role: 'admin' | 'user') => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Verificamos la sesión al cargar la aplicación
    const checkAuthentication = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await checkSession();
            setIsAuthenticated(response.isAuthenticated);
            setUserId(response.userId as string | null);
            
            // Get user data if authenticated
            if (response.isAuthenticated && response.userId) {
                try {
                    // Create user object from session data
                    setUser({
                        id: response.userId as string,
                        username: '', // We don't store username in session for now
                        email: '', // We don't store email in session for now
                        role: (response.userRole as 'admin' | 'user') || 'user'
                    });
                } catch (error) {
                    console.error("Error setting user data:", error);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await logoutUserAction();
            setIsAuthenticated(false);
            setUserId(null);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    }, []);

    // Check if user is admin
    const isAdmin = useMemo(() => {
        return user?.role === 'admin';
    }, [user]);

    // Check if user has specific role
    const hasRole = useCallback((role: 'admin' | 'user') => {
        if (!user) return false;
        if (role === 'admin') return user.role === 'admin';
        return user.role === 'user' || user.role === 'admin'; // Admin can access user routes
    }, [user]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    // Memorizar el valor del contexto para evitar recalcularlo innecesariamente
    const value = useMemo(() => ({
        isAuthenticated,
        checkAuthentication,
        userId,
        user,
        logout,
        isAdmin,
        hasRole,
        isLoading,
    }), [isAuthenticated, checkAuthentication, userId, user, logout, isAdmin, hasRole, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
