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

export default function FuncionariosTable({ searchTerm = "" }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingFunc, setEditingFunc] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    email: "",
    tel: "",
  });

  const getFuncKey = (func) => `${func.Tipo}-${func.id}`;

  const fetchFuncionarios = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/funcionarios");
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const filteredFuncionarios = funcionarios.filter((func) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      func.Nome?.toLowerCase().includes(term) ||
      func.Email?.toLowerCase().includes(term) ||
      func.Cargo?.toLowerCase().includes(term) ||
      func.Setor?.toLowerCase().includes(term)
    );
  });

  const handleInativar = async (func) => {
    const funcKey = getFuncKey(func);
    setPendingAction({ key: funcKey, type: "delete" });

    try {
      const res = await apiFetch(`/api/funcionarios/${func.id}?tipo=${func.Tipo}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao inativar");
      }

      setFuncionarios((prev) =>
        prev.filter((f) => !(f.id === func.id && f.Tipo === func.Tipo))
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleEdit = (func) => {
    setEditingFunc(getFuncKey(func));
    setEditForm({
      nome: func.Nome ?? "",
      email: func.Email ?? "",
      tel: func.Tel ?? "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingFunc) return;

    const func = funcionarios.find((f) => getFuncKey(f) === editingFunc);
    if (!func) return;

    setPendingAction({ key: editingFunc, type: "edit" });

    try {
      const res = await apiFetch(`/api/funcionarios/${func.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: func.Tipo,
          ...editForm,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }

      const updated = await res.json();
      setFuncionarios((prev) =>
        prev.map((f) =>
          getFuncKey(f) === editingFunc ? updated.funcionario : f
        )
      );
      setEditingFunc(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  const renderRow = (func) => {
    const funcKey = getFuncKey(func);
    const busy = pendingAction?.key === funcKey;
    const deletePending =
      pendingAction?.key === funcKey && pendingAction.type === "delete";
    const editPending =
      pendingAction?.key === funcKey && pendingAction.type === "edit";

    return (
      <TableRow key={funcKey} className="hover:bg-muted/50">
        <TableCell className="h-16 px-6 font-medium">{func.Nome}</TableCell>
        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          {func.Cargo}
        </TableCell>
        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          {func.Setor}
        </TableCell>
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
                    <PopoverTitle>{func.Nome}</PopoverTitle>
                    <PopoverDescription>{func.Cargo}</PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span> {func.Email}
                    </p>
                    <p>
                      <span className="font-medium">Telefone:</span> {func.Tel}
                    </p>
                    <p>
                      <span className="font-medium">Setor:</span> {func.Setor}
                    </p>
                    <p>
                      <span className="font-medium">Tipo:</span> {func.Tipo}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover
                open={editingFunc === funcKey}
                onOpenChange={(open) => {
                  if (open) handleEdit(func);
                  else setEditingFunc(null);
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
                    <PopoverTitle>Editar Funcionário</PopoverTitle>
                  </PopoverHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nome">Nome</Label>
                      <Input
                        id="edit-nome"
                        value={editForm.nome}
                        onChange={(e) =>
                          setEditForm({ ...editForm, nome: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-tel">Telefone</Label>
                      <Input
                        id="edit-tel"
                        value={editForm.tel}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tel: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="bg-transparent ring-1"
                        onClick={() => setEditingFunc(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-transparent ring-1"
                        onClick={handleSaveEdit}
                        disabled={editPending}
                      >
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
                    <PopoverTitle>Confirmar exclusão</PopoverTitle>
                    <PopoverDescription>
                      Tem certeza que deseja excluir "{func.Nome}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="bg-transparent ring-1"
                      onClick={() => {}}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-transparent ring-1"
                      onClick={() => handleInativar(func)}
                      disabled={deletePending}
                    >
                      {deletePending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Inativar"
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

  if (loading) {
    return <div className="p-6 text-center">Carregando funcionários...</div>;
  }

  return (
    <div className="w-full max-w-6xl rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-6 font-medium">Nome</TableHead>
            <TableHead className="h-12 px-4 font-medium">Cargo</TableHead>
            <TableHead className="h-12 px-4 font-medium">Setor</TableHead>
            <TableHead className="h-12 px-6 pe-20 text-right font-medium">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFuncionarios.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-6 text-center text-muted-foreground"
              >
                Nenhum funcionário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredFuncionarios.map(renderRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
