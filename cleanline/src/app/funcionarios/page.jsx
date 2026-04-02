"use client";

import { useState } from "react";
import HeaderAdm from "@/components/headerAdm";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Leaderboard1 } from "@/components/leaderboard1";

export default function Funcionarios() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <HeaderAdm onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-10">
          <div className=" justify-between flex items-center ">

            <h1 className="text-3xl md:text-4xl font-inter">Funcionários</h1>

            <div className="flex justify-between gap-40 items-center pe-35 " >
              <div className=" relative w-full items-center flex ">
                <input type="text" className=" border-2 rounded-xl scale-150  ps-2 " />
                <Search />
              </div>

              <Button className={" bg-[#24bff6] text-white scale-180 "} >Adicionar +</Button>
            </div>

          </div>





        </main>

      </div>
    </div>
  );
}
