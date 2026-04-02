"use client";

import { useRouter } from "next/navigation";

export default function HeaderAdm({ onOpenSidebar = () => {} }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("cleanline_token");
    router.push("/login");
  };

  return (
    <header className="flex h-auto w-auto items-center justify-between bg-white p-4">
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

      <p className="hidden text-center text-2xl text-[#0d005d] md:block">
        Área de administrador
      </p>

      <button
        onClick={handleLogout}
        className="transition-opacity hover:opacity-75"
        title="Sair do sistema"
      >
        <img
          src="./icons/icon_logout.png"
          className="me-2 w-8 cursor-pointer md:me-10"
          alt="Logout"
        />
      </button>
    </header>
  );
}
