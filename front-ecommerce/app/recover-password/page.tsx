import { RecoverPasswordForm } from '@/components/auth/RecoverPasswordForm';
import React from 'react';


export default function RecoverPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oil-900 to-oil-950 p-4">
            <div className="w-full max-w-md">
                <RecoverPasswordForm />
            </div>
        </div>
    );
}
