"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

// Componente Header da landing page com responsividade melhorada

export default function Header() {
    const { mounted, theme } = useTheme();
  const logoSrc =
    mounted && theme === "dark"
      ? "/logoCleanlineEscuro.png"
      : "/logoCleanline.png";
  return (
    <header className="w-auto h-auto flex items-center justify-between p-4">
          <img
            src={logoSrc}
            className="w-40 sm:w-60 md:w-80 ps-2 sm:ps-4 md:ps-15 pt-5"
            alt="Cleanline"
          />
    </header>
  );
}
