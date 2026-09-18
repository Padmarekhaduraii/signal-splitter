import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'ContentBridge AI | Fact-Anchored Social Media Content Engine',
  description:
    'Transform long-form source documents into platform-specific social media content while preserving strict factual accuracy and claim traceability.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 min-h-screen flex antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <ToastProvider>
          <div className="flex w-full min-h-screen">
            {/* Desktop Navigation Sidebar */}
            <Sidebar className="hidden md:flex" />

            {/* Main Application Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#090D16] bg-mesh">
              <Header />
              <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
