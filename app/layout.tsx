import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'LegalFlow',
  description: 'e-Signature and Case Tracking System',
};

import { CasesProvider } from './context/CasesContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <CasesProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-[#F4F7FE] p-8">
              {children}
            </main>
          </div>
        </CasesProvider>
      </body>
    </html>
  );
}
