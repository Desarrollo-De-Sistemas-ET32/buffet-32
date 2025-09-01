'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <SignIn signUpUrl="/sign-up" afterSignInUrl="/" />
    </div>
  );
}

