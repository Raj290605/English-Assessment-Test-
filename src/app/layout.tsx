import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';

export const metadata: Metadata = {
  title: 'English Assessment Platform',
  description: 'Modern 25-Question English Speaking Assessment Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col antialiased transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
