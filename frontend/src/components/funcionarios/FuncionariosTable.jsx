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

async function getErrorMessage(res, fallback) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await res.json();
    return data.error || data.message || fallback;
  }

  const text = await res.text();
  return text || fallback;
}

export default function FuncionariosTable({ searchTerm = "" }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingFunc, setEditingFunc] = useState(null); // armazena a chave composta
  const [deletingFunc, setDeletingFunc] = useState(null); // chave composta
  const [editForm, setEditForm] = useState({
    nome: "",
    email: "",
    tel: "",
    idEquipe: "",
  });

  // Dados auxiliares para dropdown de equipes
  const [equipes, setEquipes] = useState([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);

  // Gera chave única combinando Tipo e id
  const getFuncKey = (func) => `${func.Tipo}-${func.id}`;

  // Carrega equipes (para o dropdown no popover de edição)
  useEffect(() => {
    async function carregarEquipes() {
      setLoadingEquipes(true);
      try {
        const res = await apiFetch("/api/equipes");
        if (res.ok) {
          const data = await res.json();
          setEquipes(data);
        } else {
          console.error("Erro ao buscar equipes");
        }
      } catch (err) {
        console.error("Erro ao buscar equipes:", err);
      } finally {
        setLoadingEquipes(false);
      }
    }
    carregarEquipes();
  }, []);

  // Busca funcionários
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

  // Filtro por termo de busca
  const filteredFuncionarios = funcionarios.filter((func) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      func.Nome?.toLowerCase().includes(term) ||
      func.Cargo?.toLowerCase().includes(term) ||
      func.Setor?.toLowerCase().includes(term)
    );
  });

  // Excluir funcionário
  const handleExcluir = async (func) => {
    const funcKey = getFuncKey(func);
    setPendingAction({ key: funcKey, type: "delete" });

    try {
      const res = await apiFetch(`/api/funcionarios/${func.id}?tipo=${func.Tipo}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Erro ao excluir"));
      }

      setFuncionarios((prev) =>
        prev.filter((f) => !(f.id === func.id && f.Tipo === func.Tipo))
      );
      setDeletingFunc(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  // Iniciar edição
  const handleEdit = (func) => {
    setEditingFunc(getFuncKey(func));
    setEditForm({
      nome: func.Nome,
      email: func.Email,
      tel: func.Tel,
      idEquipe: func.idEquipe ?? "", // preenche com ID da equipe (se houver)
    });
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!editingFunc) return;

    // Encontra o objeto funcionário pela chave
    const func = funcionarios.find((f) => getFuncKey(f) === editingFunc);
    if (!func) return;

    setPendingAction({ key: editingFunc, type: "edit" });

    try {
      const body = {
        tipo: func.Tipo,
        nome: editForm.nome,
        email: editForm.email,
        tel: editForm.tel,
      };

      // Envia idEquipe apenas se for Funcionário de Limpeza e tiver valor
      if (func.Tipo === "Func_Limpeza" && editForm.idEquipe) {
        body.idEquipe = Number(editForm.idEquipe);
      }

      const res = await apiFetch(`/api/funcionarios/${func.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  // Renderiza cada linha da tabela
  const renderRow = (func) => {
    const funcKey = getFuncKey(func);
    const busy = pendingAction?.key === funcKey;
    const deletePending =
      pendingAction?.key === funcKey && pendingAction?.type === "delete";
    const editPending =
      pendingAction?.key === funcKey && pendingAction?.type === "edit";

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
              {/* Visualizar detalhes */}
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
                    <PopoverTitle>{func.Nome}</PopoverTitle>
                    <PopoverDescription>{func.Cargo}</PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {func.Email}</p>
                    <p><span className="font-medium">Telefone:</span> {func.Tel}</p>
                    <p><span className="font-medium">Setor:</span> {func.Setor}</p>
                    <p><span className="font-medium">Tipo:</span> {func.Tipo}</p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Editar funcionário */}
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
                    className="h-8 w-8 bg-(--btn-bg-pencil-yellow) text-[#3870CA] hover:bg-(--btn-bg-pencil-yellow) hover:text-[#3870CA] hover:opacity-90 dark:text-white dark:hover:text-white"
                    disabled={busy}
                  >
                    <PencilIcon className="size-5 text-(--pencil-yellow)" />  
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
                        onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-tel">Telefone</Label>
                      <Input
                        id="edit-tel"
                        value={editForm.tel}
                        onChange={(e) => setEditForm({ ...editForm, tel: e.target.value })}
                      />
                    </div>

                    {/* Dropdown de equipe (somente para Funcionário de Limpeza) */}
                    {func.Tipo === "Func_Limpeza" && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-equipe">Equipe</Label>
                        {loadingEquipes ? (
                          <p className="text-sm text-gray-500">Carregando equipes...</p>
                        ) : (
                          <select
                            id="edit-equipe"
                            value={editForm.idEquipe}
                            onChange={(e) => setEditForm({ ...editForm, idEquipe: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">Selecione uma equipe</option>
                            {equipes.map((eq) => (
                              <option key={eq.Id} value={eq.Id}>
                                {eq.Nome}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingFunc(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
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

              {/* Excluir */}
              <Popover
                open={deletingFunc === funcKey}
                onOpenChange={(open) => {
                  setDeletingFunc(open ? funcKey : null);
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
                      Tem certeza que deseja excluir "{func.Nome}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeletingFunc(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleExcluir(func)}
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

  if (loading) {
    return <div className="p-6 text-center">Carregando funcionários...</div>;
  }

  return (
    <div className="self-center w-full max-w-7xl rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-6 font-medium">Nome</TableHead>
            <TableHead className="h-12 px-4 font-medium">Cargo</TableHead>
            <TableHead className="h-12 px-4 font-medium">Equipe</TableHead>
            <TableHead className="h-12 px-6 pe-20 text-right font-medium">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFuncionarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
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

