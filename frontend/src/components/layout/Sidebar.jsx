"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  getSidebarItemClass,
  sidebarItems,
} from "@/lib/scripts/hoverSideBar";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

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
          "fixed left-0 top-0 z-40 h-screen pt-5 transition-all duration-300 bg-[#1c96c2] lg:max-h-100 md:static md:min-h-212.5 md:translate-x-0 md:rounded-r-[20px]",
          isMinimized ? "w-16" : "w-72 md:w-2xs",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header mobile */}
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

        <div className="hidden md:flex justify-end px-3 mb-2">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 text-white hover:bg-[#24bff6]/40 transition"
            aria-label={isMinimized ? "Expandir sidebar" : "Minimizar sidebar"}
          >

           {isMinimized ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
          </button>
        </div>

        <ul className="flex w-full flex-col gap-4 p-4">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={getSidebarItemClass(pathname, item.href)}
                onClick={onClose}
                title={isMinimized ? item.label : undefined}
              >
                <img src={item.icon} className="w-7 shrink-0" alt={item.alt} />
                {!isMinimized && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}