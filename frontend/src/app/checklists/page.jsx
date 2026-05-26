"use client";

import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import Sidebar from "@/components/layout/Sidebar";
import ChecklistsTable from "@/components/checklists/ChecklistsTable";
import SearchBar from "@/components/funcionarios/SearchBar";
import { getChecklistsHoje } from "@/lib/controllers/dashboard";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function Checklists() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const carregarChecklists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChecklistsHoje();
      setChecklists(data);
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. useEffect responsável apenas por carregar os dados iniciais
  useEffect(() => {
    carregarChecklists();
  }, [carregarChecklists]);

  useEffect(() => {

    const socket = io('https://cleanline-4kf1.onrender.com', {
      path: '/socket.io/',
      transports: ['polling'],
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('🔌 Conectado ao Socket.IO com ID:', socket.id);
    });

    socket.on('novaVistoria', (data) => {
      console.log('📡 Nova vistoria detectada! Atualizando checklists...', data);
      carregarChecklists();
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erro de conexão no Socket:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [carregarChecklists]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderAdmin onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="flex flex-col md:flex-row">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6 md:p-10 transition-all duration-300">
          <div className="justify-between flex items-center mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full">
              <h1 className="text-2xl md:text-3xl font-inter">
                Checklists
              </h1>
              <div className="relative w-full items-center flex">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
            </div>
          </div>

          {loading && checklists.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Carregando checklists...
            </div>
          ) : (
            <ChecklistsTable tasks={checklists} searchTerm={searchTerm} />
          )}
        </main>
      </div>
    </div>
  );
}
