"use client";

import { useEffect, useState } from "react";
import {
  EyeIcon,
  Loader2,
  MapPinnedIcon,
  PencilIcon,
  PlusIcon,
  RouteIcon,
  Trash2Icon,
  UserRoundIcon,
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

export default function RotasTable({ searchTerm = "", onAddClick }) {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingRota, setEditingRota] = useState(null);
  const [deletingRota, setDeletingRota] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
  });

  const fetchRotas = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/rotas");
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setRotas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRotas();
  }, []);

  const filteredRotas = rotas.filter((rota) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return rota.Nome?.toLowerCase().includes(term);
  });

  const handleExcluir = async (rota) => {
    setPendingAction({ id: rota.id, type: "delete" });
    try {
      const res = await apiFetch(`/api/rotas/${rota.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao excluir");
      }
      setRotas((prev) => prev.filter((item) => item.id !== rota.id));
      setDeletingRota(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleEdit = (rota) => {
    setEditingRota(rota.id);
    setEditForm({
      nome: rota.Nome ?? "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRota) return;

    setPendingAction({ id: editingRota, type: "edit" });
    try {
      const res = await apiFetch(`/api/rotas/${editingRota}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }
      const updated = await res.json();
      setRotas((prev) =>
        prev.map((rota) => (rota.id === editingRota ? updated.rota : rota))
      );
      setEditingRota(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const renderCard = (rota) => {
    const busy = pendingAction?.id === rota.id;
    const deletePending =
      pendingAction?.id === rota.id && pendingAction.type === "delete";
    const editPending =
      pendingAction?.id === rota.id && pendingAction.type === "edit";

    return (
      <Card
        key={rota.id}
        className="h-full shadow-md transition-all hover:scale-102 dark:border"
      >
        <CardHeader className="gap-2">
          <CardTitle className="truncate pr-2">{rota.Nome}</CardTitle>
          <CardDescription>Rota operacional</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <MapPinnedIcon className="size-4" />
                <span className="text-xs font-medium uppercase">Setores</span>
              </div>
              <p className="text-2xl font-semibold">
                {rota.TotalSetores ?? 0}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <RouteIcon className="size-4" />
                <span className="text-xs font-medium uppercase">Rota</span>
              </div>
              <p className="truncate text-sm font-medium">{rota.Nome}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <UserRoundIcon className="size-3.5" />
                Administrador
              </p>
              <p className="text-card-foreground">
                {rota.Administrador || "Não informado"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Setores vinculados
              </p>
              <p className="line-clamp-2 text-card-foreground">
                {rota.Setores || "Nenhum setor vinculado"}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto justify-between gap-3">
          <Badge variant="outline">ID {rota.id}</Badge>
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
                  <PopoverTitle>{rota.Nome}</PopoverTitle>
                  <PopoverDescription>
                    {rota.TotalSetores} setor(es) vinculado(s)
                  </PopoverDescription>
                </PopoverHeader>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Administrador:</span>{" "}
                    {rota.Administrador || "Não informado"}
                  </p>
                  <p>
                    <span className="font-medium">Setores:</span>{" "}
                    {rota.Setores || "Nenhum"}
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={editingRota === rota.id}
              onOpenChange={(open) => {
                if (open) handleEdit(rota);
                else setEditingRota(null);
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
                  <PopoverTitle>Editar rota</PopoverTitle>
                </PopoverHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-rota-${rota.id}`}>Nome</Label>
                    <Input
                      id={`edit-rota-${rota.id}`}
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
                      onClick={() => setEditingRota(null)}
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
              open={deletingRota === rota.id}
              onOpenChange={(open) => {
                setDeletingRota(open ? rota.id : null);
              }}
            >
              <PopoverTrigger asChild>
              <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 border-[#C42C29] bg-(--btn-bg-trash-red) text-white  hover:bg-[#fcc6c6]"
                    disabled={busy}
                  >
                    {deletePending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="size-5 text-(--trash-red)" />
                    )}
                  </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <PopoverHeader>
                  <PopoverTitle>Confirmar exclusão</PopoverTitle>
                  <PopoverDescription>
                    Tem certeza que deseja excluir "{rota.Nome}"?
                  </PopoverDescription>
                </PopoverHeader>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeletingRota(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleExcluir(rota)}
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

  const renderCreateCard = () => (
    <button
      type="button"
      onClick={onAddClick}
      className="flex cursor-pointer h-full min-h-82 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-primary/45 bg-card p-6 text-center text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-muted/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <PlusIcon className="size-8" />
      </span>
      <span className="text-lg font-semibold">Criar nova rota</span>
      <span className="text-sm text-muted-foreground">
        Adicionar uma rota ao cadastro
      </span>
    </button>
  );

  if (loading) {
    return <div className="p-6 text-center">Carregando rotas...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {filteredRotas.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Nenhuma rota encontrada.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {filteredRotas.map(renderCard)}
          {onAddClick && renderCreateCard()}
        </div>
      )}
    </div>
  );
}
