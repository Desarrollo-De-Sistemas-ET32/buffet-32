import ClerkProviderWrapper from 'components/clerk-provider';
import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/store';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { baseUrl } from 'lib/utils';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <ClerkProviderWrapper>
      <html lang="en" className={GeistSans.variable}>
        <body className="bg-white text-neutral-900 selection:bg-[#84D187] selection:text-[#12361b]">
          <CartProvider cartPromise={cart}>
            <div className="bg-[#2C742F] text-white text-sm">
              <div className="container mx-auto flex items-center justify-center md:justify-between p-2">
                <div className="flex items-center">
                  <span>Open an account or sign in. 20% off everything.</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a className="hover:text-[#84D187]" href="#">
                    Sign up
                  </a>
                  <a className="hover:text-[#84D187]" href="#">
                    Sign in
                  </a>
                </div>
              </div>
            </div>
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
