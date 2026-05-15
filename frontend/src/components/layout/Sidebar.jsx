"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  getSidebarItemClass,
  sidebarItems,
} from "@/lib/scripts/hoverSideBar";
import { PanelLeftOpen, PanelLeftClose, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[var(--sidebar-overlay)] md:hidden"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-40 h-screen bg-[var(--sidebar-background)] pt-5 text-white shadow-2xl transition-all duration-300 md:static md:h-screen md:translate-x-0 md:rounded-r-[20px]",
          isMinimized ? "w-16" : "w-72 md:w-2xs",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      > 
        {/* Header mobile */}
        <div className="mb-4 flex items-center justify-between px-4 md:hidden">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-white hover:bg-[var(--sidebar-hover)]"
            onClick={onClose}
            aria-label="Fechar sidebar"
          >
            <img src="./icons/icon_close.png" className="w-8" alt="Fechar" />
          </button>
        </div>

        <div className={["flex items-center px-3 mb-2", isMinimized ? "justify-center" : "justify-end"].join(" ")}>
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hidden md:block rounded-lg p-1.5 text-white transition hover:bg-[var(--sidebar-hover)]"
            aria-label={isMinimized ? "Expandir sidebar" : "Minimizar sidebar"}
          >
            {isMinimized ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
          </button>
        </div>

        <ul className={["flex w-full flex-col gap-4", isMinimized ? "px-2 py-4" : "p-4"].join(" ")}>
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={getSidebarItemClass(pathname, item.href, isMinimized)}
                onClick={onClose}
                title={isMinimized ? item.label : undefined}
              >
                 <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  <img
                    src={item.icon}
                    className="max-h-7 max-w-7 object-contain"
                    alt={item.alt}
                  />
                </span>
                {!isMinimized && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
