'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}

