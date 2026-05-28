"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export default function Header() {
    const { mounted, theme } = useTheme();
  const logoSrc =
    mounted && theme === "dark"
      ? "/logoCleanlineEscuro.png"
      : "/logoCleanline.png";
  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between p-6 lg:px-12 relative z-50">
      <div className="flex items-center">
        <img
          src={logoSrc}
          className="h-10 w-auto"
          alt="Cleanline"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <span className="hidden md:block text-sm font-medium text-[#58708c] dark:text-[#93abc0]">
          Já possui conta?
        </span>
        <a href="/login">
          <button className="px-6 py-2.5 border border-[#1c96c2] text-[#1c96c2] hover:bg-[#1c96c2] hover:text-white font-semibold rounded-lg transition-all duration-300 text-sm">
            Entrar
          </button>
        </a>
      </div>
    </header>
  );
}
