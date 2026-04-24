"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function HeaderAdmin({ onOpenSidebar = () => {} }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="relative flex h-auto w-auto items-center justify-between bg-white p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-[#1c96c2] px-3 py-2 text-white md:hidden"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <span className="block h-0.5 w-5 bg-white" />
          <span className="mt-1 block h-0.5 w-5 bg-white" />
          <span className="mt-1 block h-0.5 w-5 bg-white" />
        </button>

        <a href="."><img
          src="logoCleanline.png"
          className="w-50 md:w-80 lg:ps-15 sm:ps-0"
          alt="Cleanline"
        /></a>
      </div>

      <p className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl text-[#0d005d] md:block">
        Área de administrador
      </p>

      <button
        onClick={handleLogout}
        className="transition-opacity hover:opacity-75"
        title="Sair do sistema"
      >
        <img
          src="./icons/icon_logout.png"
          className="me-10 w-8 cursor-pointer md:me-10"
          alt="Logout"
        />
      </button>
    </header>
  );
}
