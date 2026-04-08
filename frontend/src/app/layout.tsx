import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import { StyledComponentsRegistry } from './registry';
import { Providers } from './providers';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Arena7 Esports — Plataforma de Campeonatos',
  description:
    'Crie, organize e participe de campeonatos online de EA Sports FC, Valorant, Fortnite e muito mais.',
  keywords: 'campeonatos, esports, torneios, valorant, fortnite, fifa, ea fc',
  openGraph: {
    title: 'Arena7 Esports',
    description: 'A maior plataforma de campeonatos online do Brasil',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} dark`} suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
