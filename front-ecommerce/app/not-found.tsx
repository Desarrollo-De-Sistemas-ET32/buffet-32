    import { ThemeProvider } from '@/components/theme-provider';
import Link from 'next/link';

export default function NotFound() {
  return (
    <ThemeProvider>
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold text-primary">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="underline mt-4"
      >
        Go Back Home
      </Link>
    </div>
    </ThemeProvider>
  );
}