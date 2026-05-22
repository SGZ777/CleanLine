"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  EyeIcon,
  Loader2,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function EquipesTable({ searchTerm = "" }) {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "" });

  // Buscar equipes
  const fetchEquipes = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/equipes");
      if (!res.ok) throw new Error("Erro ao carregar equipes");
      const data = await res.json();
      setEquipes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipes();
  }, []);

  // Filtrar equipes pela busca
  const filteredEquipes = equipes.filter((equipe) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return equipe.Nome?.toLowerCase().includes(term);
  });

  // Excluir equipe
  const handleExcluir = async (equipe) => {
    setPendingAction({ id: equipe.Id, type: "delete" });
    try {
      const res = await apiFetch(`/api/equipes/${equipe.Id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao excluir");
      }
      setEquipes((prev) => prev.filter((item) => item.Id !== equipe.Id));
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  // Iniciar edição
  const handleEdit = (equipe) => {
    setEditingEquipe(equipe.Id);
    setEditForm({ nome: equipe.Nome });
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!editingEquipe) return;

    setPendingAction({ id: editingEquipe, type: "edit" });
    try {
      const res = await apiFetch(`/api/equipes/${editingEquipe}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editForm.nome }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }
      const updated = await res.json();
      setEquipes((prev) =>
        prev.map((eq) => (eq.Id === editingEquipe ? { ...eq, Nome: editForm.nome } : eq))
      );
      setEditingEquipe(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  // Renderizar cada linha
  const renderRow = (equipe) => {
    const busy = pendingAction?.id === equipe.Id;
    const deletePending =
      pendingAction?.id === equipe.Id && pendingAction?.type === "delete";
    const editPending =
      pendingAction?.id === equipe.Id && pendingAction?.type === "edit";

    return (
      <TableRow key={equipe.Id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-6 font-medium">{equipe.Nome}</TableCell>
        <TableCell className="h-16 px-6">
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              {/* Visualizar */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-none bg-[#00AFDC] text-white hover:bg-[#0098c0] hover:text-white"
                    disabled={busy}
                    aria-label={`Ver detalhes de ${equipe.Nome}`}
                  >
                    <EyeIcon color="white" className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>{equipe.Nome}</PopoverTitle>
                    <PopoverDescription>
                      {equipe.TotalFuncionarios} funcionário(s), {equipe.TotalSetores} setor(es)
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Funcionários:</span> {equipe.Funcionarios}</p>
                    <p><span className="font-medium">Setores:</span> {equipe.Setores}</p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Editar */}
              <Popover
                open={editingEquipe === equipe.Id}
                onOpenChange={(open) => {
                  if (open) handleEdit(equipe);
                  else setEditingEquipe(null);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 border-none bg-[#FFBF00] text-white hover:bg-[#e0a800] hover:text-white"
                    disabled={busy}
                    aria-label={`Editar ${equipe.Nome}`}
                  >
                    <PencilIcon color="white" className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>Editar equipe</PopoverTitle>
                  </PopoverHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-equipe-${equipe.Id}`}>Nome</Label>
                      <Input
                        id={`edit-equipe-${equipe.Id}`}
                        value={editForm.nome}
                        onChange={(e) =>
                          setEditForm({ ...editForm, nome: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingEquipe(null)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={editPending}>
                        {editPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Excluir */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 border-none bg-[#FF3131] text-white hover:bg-[#db2c2c] hover:text-white"
                    disabled={busy}
                    aria-label={`Excluir ${equipe.Nome}`}
                  >
                    {deletePending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2Icon color="white" className="size-5" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>Confirmar exclusão</PopoverTitle>
                    <PopoverDescription>
                      Tem certeza que deseja excluir "{equipe.Nome}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {}}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleExcluir(equipe)}
                      disabled={deletePending}
                    >
                      {deletePending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Excluir"
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) return <div className="p-6 text-center">Carregando equipes...</div>;

  return (
    <div className="w-full max-w-6xl rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-6 font-medium">Nome</TableHead>
            <TableHead className="h-12 px-6 text-right font-medium pe-20">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEquipes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                Nenhuma equipe encontrada.
              </TableCell>
            </TableRow>
          ) : (
            filteredEquipes.map(renderRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
