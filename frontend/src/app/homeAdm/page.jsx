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

              <main className="flex-1 p-4 sm:p-6 md:p-10">
          <h1 className="mx-auto max-w-5xl text-center font-inter text-3xl md:mx-0 md:pb-8 md:ms-10 md:text-left md:text-4xl">
            Olá, {userName}! | Visão Geral do{" "}
            <span className="text-[#24bff6]">5S</span>
          </h1>
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center lg:max-w-none lg:flex-row lg:items-start lg:justify-start">
            <div className="flex w-full flex-col items-center lg:grid lg:w-auto lg:justify-items-start">
              <div className="flex w-full flex-col items-center lg:flex lg:flex-row lg:items-start">
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
