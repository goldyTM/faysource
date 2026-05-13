import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FaySource — Trusted African Supplier Hub',
  description: 'Curated sourcing platform for African vendors, shipping agents, import guides, and verified supplier leads.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
