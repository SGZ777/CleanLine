"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { EyeIcon, Loader2, PencilIcon, Trash2Icon } from "lucide-react";

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

export default function RotasTable({ searchTerm = "" }) {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingRota, setEditingRota] = useState(null);
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

    return (
      rota.Nome?.toLowerCase().includes(term) ||
      rota.Setores?.toLowerCase().includes(term) ||
      rota.Administrador?.toLowerCase().includes(term)
    );
  });

  const handleExcluir = async (rota) => {
    setPendingAction({ id: rota.id, type: "delete" });
    try {
      const res = await apiFetch(`/api/rotas/${rota.id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao excluir");
      }
      setRotas((prev) => prev.filter((item) => item.id !== rota.id));
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

  const renderRow = (rota) => {
    const busy = pendingAction?.id === rota.id;
    const deletePending =
      pendingAction?.id === rota.id && pendingAction.type === "delete";
    const editPending =
      pendingAction?.id === rota.id && pendingAction.type === "edit";

    return (
      <TableRow key={rota.id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-6 font-medium">{rota.Nome}</TableCell>
        <TableCell className="h-16 px-6">
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={busy}
                  >
                    <EyeIcon color="white" className="size-5" />
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
                      {rota.Administrador}
                    </p>
                    <p>
                      <span className="font-medium">Setores:</span>{" "}
                      {rota.Setores}
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
                    className="h-8 w-8"
                    disabled={busy}
                  >
                    <PencilIcon color="white" className="size-5" />
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
                        onChange={(e) =>
                          setEditForm({ ...editForm, nome: e.target.value })
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                    disabled={busy}
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
                    <PopoverTitle>Confirmar exclusao</PopoverTitle>
                    <PopoverDescription>
                      Tem certeza que deseja excluir "{rota.Nome}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {}}>
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
          </TooltipProvider>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) return <div className="p-6 text-center">Carregando rotas...</div>;

  return (
    <div className="w-full max-w-6xl rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-6 font-medium">Nome</TableHead>
            <TableHead className="h-12 px-6 text-right font-medium pe-20">
              Acoes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRotas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                Nenhuma rota encontrada.
              </TableCell>
            </TableRow>
          ) : (
            filteredRotas.map(renderRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
