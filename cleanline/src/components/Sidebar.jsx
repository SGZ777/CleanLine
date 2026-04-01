"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getSidebarItemClass,
  sidebarItems,
} from "@/lib/scripts/hoverSideBar";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-2xs min-h-[850px] flex bg-[#1c96c2] rounded-r-[20px] pt-5">
      <ul className="flex w-full flex-col gap-4 p-4">
        {sidebarItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={getSidebarItemClass(pathname, item.href)}
            >
              <img src={item.icon} className="w-7" alt={item.alt} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
