"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getSidebarItemClass,
  sidebarItems,
} from "@/lib/scripts/hoverSideBar";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[#0d005d]/30 md:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-40 h-screen w-72 bg-[#1c96c2] pt-5 transition-transform duration-300 md:static md:min-h-212.5 md:w-2xs md:translate-x-0 md:rounded-r-[20px]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-4 flex items-center justify-between px-4 md:hidden">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-white hover:bg-[#24bff6]/40"
            onClick={onClose}
            aria-label="Fechar sidebar"
          >
            <img src="./icons/icon_close.png" className="w-8" alt="Fechar" />
          </button>
        </div>

        <ul className="flex w-full flex-col gap-4 p-4">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={getSidebarItemClass(pathname, item.href)}
                onClick={onClose}
              >
                <img src={item.icon} className="w-7" alt={item.alt} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
