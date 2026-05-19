"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { clearAuthSession } from "@/lib/authSession";
import { useRouter } from "next/navigation";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import PontuacaoMedia from "@/components/dashboard/PontuacaoMedia";
import Sidebar from "@/components/layout/Sidebar";
import MaiorNotaDiaria from "@/components/dashboard/MaiorNotaDiaria";
import { PontuacaoGrafico } from "@/components/dashboard/PontuacaoGrafico";
import { LeaderboardCard } from "@/components/dashboard/leaderboard/LeaderboardCard";
import TutorialModal from "@/components/tutorial/TutorialModal";

// Página de dashboard (home administrativo) com responsividade melhorada
export default function HomeAdm() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Administrador");
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStorageKey, setTutorialStorageKey] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const response = await apiFetch("/api/user");

        if (!response.ok) {
          if (!ignore) {
            clearAuthSession();
            router.replace("/login");
          }

          return;
        }

        const data = await response.json();

        if (!ignore && data?.user) {
          const tutorialKey = `cleanline_tutorial_seen_${data.user.id}`;

          if (data.user.name) {
            setUserName(data.user.name);
          }

          setTutorialStorageKey(tutorialKey);

          if (!localStorage.getItem(tutorialKey)) {
            setShowTutorial(true);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuario:", error);
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleCloseTutorial = () => {
    if (tutorialStorageKey) {
      localStorage.setItem(tutorialStorageKey, "true");
    }

    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-10">
          <h1 className="font-inter text-xl sm:text-2xl md:text-3xl lg:text-4xl md:pb-4 lg:pb-8 px-2 sm:px-0">
            Olá, {userName}! | Visão Geral do{" "}
            <span className="text-[#24bff6]">5S</span>
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
            <div className="w-full lg:w-auto lg:grid">
              <div className="flex flex-col sm:flex-row lg:flex gap-3 sm:gap-4 lg:gap-6">
                <PontuacaoMedia />
                <MaiorNotaDiaria />
              </div>
              <PontuacaoGrafico />
            </div>
            <LeaderboardCard />
          </div>
        </main>
      </div>
      {showTutorial && (
        <TutorialModal userName={userName} onClose={handleCloseTutorial} />
      )}
    </div>
  );
}
