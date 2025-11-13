import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oil-900 to-oil-950 p-4">
            <div className="w-full max-w-md ">
                <ResetPasswordForm />
            </div>
        </div>
        </Suspense>
    );
}
