"use client";

import { apiFetch } from "@/lib/api";
import { clearAuthSession } from "@/lib/authSession";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderAdmin({ onOpenSidebar = () => {} }) {
  const router = useRouter();
  const { mounted, theme } = useTheme();
  const logoSrc =
    mounted && theme === "dark"
      ? "/logoCleanlineEscuro.png"
      : "/logoCleanline.png";

  const handleLogout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <header className="relative flex min-h-20 w-full items-center justify-between gap-3 border-b border-border bg-card/90 p-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:hidden"
          title="Abrir menu"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <img
          src={logoSrc}
          className="w-36 shrink sm:w-50 md:w-80 lg:ps-15 sm:ps-0"
          alt="Cleanline"
        />
      </div>

      <p className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-center text-xl text-foreground/90 md:block">
        Área de administrador
      </p>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="mr-2 cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted md:mr-10"
          title="Sair do sistema"
          aria-label="Sair do sistema"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
