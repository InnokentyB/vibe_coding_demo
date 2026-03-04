import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EquipReq - Advanced Equipment Requests',
  description: 'Submit and track your equipment purchase requests.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <main className="container">
          <header className="header fade-in">
            <h1>EquipReq</h1>
            <p>Streamlined Equipment Purchase Requests</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
