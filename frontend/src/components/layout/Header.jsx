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
          className="w-50 md:w-80 "
          alt="Cleanline"
        />
      </div>  
    </header>
  );
}
