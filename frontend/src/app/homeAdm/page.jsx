"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import PontuacaoMedia from "@/components/dashboard/PontuacaoMedia";
import Sidebar from "@/components/layout/Sidebar";
import MaiorNotaDiaria from "@/components/dashboard/MaiorNotaDiaria";
import { PontuacaoGrafico } from "@/components/dashboard/PontuacaoGrafico";
import { LeaderboardCard } from "@/components/dashboard/leaderboard/LeaderboardCard";
import TutorialModal from "@/components/tutorial/TutorialModal";

export default function HomeAdm() {
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
  }, []);

  const handleCloseTutorial = () => {
    if (tutorialStorageKey) {
      localStorage.setItem(tutorialStorageKey, "true");
    }

    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-10">
          <h1 className="font-inter text-3xl md:pb-8 md:text-4xl">
            Olá, {userName}! | Visão Geral do{" "}
            <span className="text-[#24bff6]">5S</span>
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-start">
            <div className="lg:grid">
              <div className="lg:flex">
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
