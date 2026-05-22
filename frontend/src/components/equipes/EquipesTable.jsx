"use client";

import { useEffect, useState } from "react";
import {
  EyeIcon,
  Loader2,
  MapPinnedIcon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function EquipesTable({ searchTerm = "" }) {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingEquipe, setEditingEquipe] = useState(null);
  const [deletingEquipe, setDeletingEquipe] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "" });

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

  const filteredEquipes = equipes.filter((equipe) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return equipe.Nome?.toLowerCase().includes(term);
  });

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
      setDeletingEquipe(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleEdit = (equipe) => {
    setEditingEquipe(equipe.Id);
    setEditForm({ nome: equipe.Nome });
  };

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
      await res.json();
      setEquipes((prev) =>
        prev.map((eq) =>
          eq.Id === editingEquipe ? { ...eq, Nome: editForm.nome } : eq
        )
      );
      setEditingEquipe(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const renderCard = (equipe) => {
    const busy = pendingAction?.id === equipe.Id;
    const deletePending =
      pendingAction?.id === equipe.Id && pendingAction?.type === "delete";
    const editPending =
      pendingAction?.id === equipe.Id && pendingAction?.type === "edit";

    return (
      <Card
        key={equipe.Id}
        className="border shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
      >
        <CardHeader className="gap-2">
          <CardTitle className="truncate pr-2">{equipe.Nome}</CardTitle>
          <CardDescription>Equipe de limpeza</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="size-4" />
                <span className="text-xs font-medium uppercase">
                  Funcionários
                </span>
              </div>
              <p className="text-2xl font-semibold">
                {equipe.TotalFuncionarios ?? 0}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <MapPinnedIcon className="size-4" />
                <span className="text-xs font-medium uppercase">Setores</span>
              </div>
              <p className="text-2xl font-semibold">
                {equipe.TotalSetores ?? 0}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Integrantes
              </p>
              <p className="line-clamp-2 text-card-foreground">
                {equipe.Funcionarios || "Nenhum funcionario vinculado"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Setores
              </p>
              <p className="line-clamp-2 text-card-foreground">
                {equipe.Setores || "Nenhum setor vinculado"}
              </p>
            </div>
          </div>
        </CardContent>

        

        <CardFooter className="justify-between gap-3">
          <Badge variant="outline">ID {equipe.Id}</Badge>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-none bg-[#00AFDC] text-white hover:bg-[#0098c0] hover:text-white"
                  disabled={busy}
                  aria-label={`Ver detalhes de ${equipe.Nome}`}
                >
                  <EyeIcon className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <PopoverHeader>
                  <PopoverTitle>{equipe.Nome}</PopoverTitle>
                  <PopoverDescription>
                    {equipe.TotalFuncionarios} funcionario(s),{" "}
                    {equipe.TotalSetores} setor(es)
                  </PopoverDescription>
                </PopoverHeader>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Funcionarios:</span>{" "}
                    {equipe.Funcionarios || "Nenhum"}
                  </p>
                  <p>
                    <span className="font-medium">Setores:</span>{" "}
                    {equipe.Setores || "Nenhum"}
                  </p>
                </div>
              </PopoverContent>
            </Popover>

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
                  <PencilIcon className="size-5" />
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
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          nome: event.target.value,
                        })
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

            <Popover
              open={deletingEquipe === equipe.Id}
              onOpenChange={(open) => setDeletingEquipe(open ? equipe.Id : null)}
            >
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
                    <Trash2Icon className="size-5" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <PopoverHeader>
                  <PopoverTitle>Confirmar exclusao</PopoverTitle>
                  <PopoverDescription>
                    Tem certeza que deseja excluir "{equipe.Nome}"?
                  </PopoverDescription>
                </PopoverHeader>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeletingEquipe(null)}
                  >
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
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando equipes...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {filteredEquipes.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Nenhuma equipe encontrada.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredEquipes.map(renderCard)}
        </div>
      )}
    </div>
  );
}
