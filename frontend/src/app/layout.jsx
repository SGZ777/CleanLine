import "./globals.css";
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: "Cleanline | Sua empresa limpa e organizada.",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}