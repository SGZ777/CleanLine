"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

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
            className="w-80 ps-15 pt-5"
            alt="Cleanline"
          />
    </header>
  );
}
