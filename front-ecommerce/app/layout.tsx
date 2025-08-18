import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
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
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <div className="bg-neutral-800 text-neutral-300 text-sm">
            <div className="container mx-auto flex items-center justify-center md:justify-between p-2">
              <div className="flex items-center">
                <span>Open an account or sign in. 20% off everything.</span>
              </div>
              <div className="flex items-center space-x-4">

                <a href="#">Sign up</a>
                <a href="#">Sign in</a>
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
  );
}
