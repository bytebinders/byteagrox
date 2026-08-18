import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ByteAgroX — Agricultural Trade Built on Trust',
  description: 'Trusted digital agricultural marketplace and escrow settlement system serving Hadejia, Jigawa State, Nigeria.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
