"use client";

import { useEffect, useState } from "react";
import {
  EyeIcon,
  MapPinnedIcon,
  PencilIcon,
  PlusIcon,
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
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EquipesTable({ searchTerm = "", onAddClick }) {
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
        className="h-full shadow-md transition-all hover:scale-102 dark:border"
      >
        <CardHeader className="gap-2">
          <CardTitle className="truncate pr-2">{equipe.Nome}</CardTitle>
          <CardDescription>Equipe de limpeza</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                {equipe.Funcionarios || "Nenhum funcionário vinculado"}
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

        <CardFooter className="mt-auto justify-between gap-3">
          <Badge variant="outline">ID {equipe.Id}</Badge>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 border-none bg-(--btn-bg-eye-blue) text-[#3870CA] hover:bg-(--btn-bg-eye-blue) hover:text-[#3870CA] hover:opacity-90 dark:text-white dark:hover:text-white"
                  disabled={busy}
                >
                  <EyeIcon className="size-5 text-(--eye-blue)" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <PopoverHeader>
                  <PopoverTitle>{equipe.Nome}</PopoverTitle>
                  <PopoverDescription>
                    {equipe.TotalFuncionarios} funcionário(s),{" "}
                    {equipe.TotalSetores} setor(es)
                  </PopoverDescription>
                </PopoverHeader>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Funcionários:</span>{" "}
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
                  className="h-8 w-8 bg-(--btn-bg-pencil-yellow) text-[#3870CA] hover:bg-(--btn-bg-pencil-yellow) hover:text-[#3870CA] hover:opacity-90 dark:text-white dark:hover:text-white"
                  disabled={busy}
                >
                  <PencilIcon className="size-5 text-(--pencil-yellow)" />
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
                        <Spinner className="h-4 w-4" />
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
                  className="h-8 w-8 border-[#C42C29] bg-(--btn-bg-trash-red) text-white  hover:bg-[#fcc6c6]"
                  disabled={busy}
                >
                  {deletePending ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Trash2Icon className="size-5 text-(--trash-red)" />
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
                      <Spinner className="h-4 w-4" />
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

  const renderCreateCard = () => (
    <button
      type="button"
      onClick={onAddClick}
      className="flex cursor-pointer h-full min-h-82 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-primary/45 bg-card p-6 text-center text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-muted/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <PlusIcon className="size-8" />
      </span>
      <span className="text-lg font-semibold">Criar nova equipe</span>
      <span className="text-sm text-muted-foreground">
        Adicionar uma equipe ao cadastro
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-center text-muted-foreground">
        <Spinner />
        Carregando equipes...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {filteredEquipes.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Nenhuma equipe encontrada.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {filteredEquipes.map(renderCard)}
          {onAddClick && renderCreateCard()}
        </div>
      )}
    </div>
  );
}
