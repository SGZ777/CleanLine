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

export default function SetoresTable({ searchTerm = "" }) {
  // Dados principais
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingSetor, setEditingSetor] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    tagNfc: "",
    idEquipe: "",
    rotasSelecionadas: [],
  });

  // Dados auxiliares para edição
  const [equipes, setEquipes] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);
  const [loadingRotas, setLoadingRotas] = useState(true);

  // Buscar setores
  const fetchSetores = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/setores");
      if (!res.ok) throw new Error("Erro ao carregar");
      const data = await res.json();
      setSetores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar equipes e rotas (para edição)
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resEquipes, resRotas] = await Promise.all([
          apiFetch("/api/equipes"),
          apiFetch("/api/rotas"),
        ]);
        if (resEquipes.ok) setEquipes(await resEquipes.json());
        if (resRotas.ok) setRotas(await resRotas.json());
      } catch (err) {
        console.error("Erro ao carregar dados auxiliares", err);
      } finally {
        setLoadingEquipes(false);
        setLoadingRotas(false);
      }
    }
    carregarDados();
  }, []);

  // Buscar setores na montagem
  useEffect(() => {
    fetchSetores();
  }, []);

  // Filtro por termo de busca
  const filteredSetores = setores.filter((setor) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      setor.Nome?.toLowerCase().includes(term) ||
      setor.TagNfc?.toLowerCase().includes(term) ||
      setor.Equipe?.toLowerCase().includes(term) ||
      setor.Rotas?.toLowerCase().includes(term)
    );
  });

  // Handlers de exclusão
  const handleExcluir = async (setor) => {
    setPendingAction({ id: setor.id, type: "delete" });
    try {
      const res = await apiFetch(`/api/setores/${setor.id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao excluir");
      }
      setSetores((prev) => prev.filter((item) => item.id !== setor.id));
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
    }
  };

  // Handlers de edição
  const handleEdit = (setor) => {
    setEditingSetor(setor.id);
    setEditForm({
      nome: setor.Nome ?? "",
      tagNfc: setor.TagNfc ?? "",
      idEquipe: setor.idEquipe ?? "",
      rotasSelecionadas: setor.idRotas ?? [],
    });
  };

  const handleSaveEdit = async () => {
    if (!editingSetor) return;

    setPendingAction({ id: editingSetor, type: "edit" });
    try {
      const res = await apiFetch(`/api/setores/${editingSetor}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editForm.nome,
          tagNfc: editForm.tagNfc,
          idEquipe: Number(editForm.idEquipe),
          rotas: editForm.rotasSelecionadas,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar");
      }
      const updated = await res.json();
      setSetores((prev) =>
        prev.map((setor) => (setor.id === editingSetor ? updated.setor : setor))
      );
      
    } catch (error) {
      alert(error.message);
    } finally {
      setPendingAction(null);
      setEditingSetor(null);
    }
  };

  // Renderização de cada linha
  const renderRow = (setor) => {
    const busy = pendingAction?.id === setor.id;
    const deletePending =
      pendingAction?.id === setor.id && pendingAction.type === "delete";
    const editPending =
      pendingAction?.id === setor.id && pendingAction.type === "edit";

    return (
      <TableRow key={setor.id} className="hover:bg-muted/50">
        <TableCell className="h-16 px-6 font-medium">{setor.Nome}</TableCell>
        <TableCell className="h-16 px-6">
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              {/* Visualizar detalhes */}
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
                    <PopoverTitle>{setor.Nome}</PopoverTitle>
                    <PopoverDescription>
                      {setor.TotalRotas} rota(s) vinculada(s)
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Tag NFC:</span> {setor.TagNfc}
                    </p>
                    <p>
                      <span className="font-medium">Equipe:</span> {setor.Equipe}
                    </p>
                    <p>
                      <span className="font-medium">Rotas:</span> {setor.Rotas}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Editar setor */}
              <Popover
                open={editingSetor === setor.id}
                onOpenChange={(open) => {
                  if (open) handleEdit(setor);
                  else setEditingSetor(null);
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

                <PopoverContent
                  align="end"
                  className="w-96 max-h-[80vh] overflow-y-auto p-5"
                >
                  <PopoverHeader>
                    <PopoverTitle>Editar setor</PopoverTitle>
                  </PopoverHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-setor-${setor.id}`}>Nome</Label>
                      <Input
                        id={`edit-setor-${setor.id}`}
                        value={editForm.nome}
                        onChange={(e) =>
                          setEditForm({ ...editForm, nome: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-tag-${setor.id}`}>Tag NFC</Label>
                      <Input
                        id={`edit-tag-${setor.id}`}
                        value={editForm.tagNfc}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tagNfc: e.target.value })
                        }
                      />
                    </div>

                    {/* Dropdown de equipe */}
                    <div className="space-y-2">
                      <Label htmlFor={`edit-equipe-${setor.id}`}>Equipe</Label>
                      {loadingEquipes ? (
                        <p className="text-sm text-gray-500">Carregando...</p>
                      ) : (
                        <select
                          id={`edit-equipe-${setor.id}`}
                          value={editForm.idEquipe}
                          onChange={(e) =>
                            setEditForm({ ...editForm, idEquipe: e.target.value })
                          }
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

                    {/* Checkboxes de rotas */}
                    <div className="space-y-2">
                      <Label>Rotas</Label>
                      {loadingRotas ? (
                        <p className="text-sm text-gray-500">Carregando...</p>
                      ) : rotas.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhuma rota disponível</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                          {rotas.map((rota) => (
                            <label
                              key={rota.id}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editForm.rotasSelecionadas.includes(rota.id)}
                                onChange={() => {
                                  setEditForm((prev) => ({
                                    ...prev,
                                    rotasSelecionadas: prev.rotasSelecionadas.includes(
                                      rota.id
                                    )
                                      ? prev.rotasSelecionadas.filter(
                                          (id) => id !== rota.id
                                        )
                                      : [...prev.rotasSelecionadas, rota.id],
                                  }));
                                }}
                              />
                              {rota.Nome}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSetor(null)}
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

              {/* Excluir setor */}
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
                      Tem certeza que deseja excluir "{setor.Nome}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {}}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleExcluir(setor)}
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

  if (loading) return <div className="p-6 text-center">Carregando setores...</div>;

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
          {filteredSetores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                className="py-6 text-center text-muted-foreground"
              >
                Nenhum setor encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredSetores.map(renderRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}