import "./globals.css";
import { Inter, Poppins } from 'next/font/google';
import ThemeProvider from "@/components/theme/ThemeProvider";

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

const themeScript = `
  (() => {
    try {
      const storageKey = "cleanline_theme";
      const savedTheme = localStorage.getItem(storageKey);
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const theme = savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : systemTheme;

      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
