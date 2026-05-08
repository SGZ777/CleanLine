"use client";

import {
  EyeIcon,
  Loader2,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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

// Função para determinar a cor da nota
const getNotaColor = (nota) => {
  if (nota === null || nota === undefined) return "text-gray-400";
  const valor = Number(nota);
  if (valor >= 8) return "text-green-600 font-semibold";
  if (valor >= 6) return "text-yellow-500 font-semibold";
  return "text-red-500 font-semibold";
};

export default function ChecklistsTable({ tasks = [], searchTerm = "" }) {
  const [pendingAction, setPendingAction] = useState(null);

  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      task.setor?.toLowerCase().includes(term) ||
      (task.nota !== null && task.nota.toString().includes(term)) ||
      task.id?.toString().includes(term)
    );
  });

  const isTaskBusy = (taskId) => pendingAction?.id === taskId;

  const handleDelete = (task) => {
    setPendingAction({ id: task.id, type: "delete" });
    setTimeout(() => {
      setPendingAction(null);
      // Aqui você pode chamar um endpoint de exclusão lógica, se necessário
    }, 1000);
  };

  const renderTaskRow = (task) => {
    const busy = isTaskBusy(task.id);
    const deletePending =
      pendingAction?.id === task.id && pendingAction.type === "delete";

    // Se a nota for diferente de null, houve vistoria hoje
    const hasVistoria = task.nota !== null && task.nota !== undefined;
    const setorColorClass = hasVistoria ? "text-green-600" : "text-red-500";



    const respostas = [
      { id: 1, theme: "Organização do ambiente", label: "Ótimo" },
      { id: 2, theme: "Limpeza de superfícies", label: "Péssimo" },
      { id: 3, theme: "Descarte de resíduos", label: "Ok" },
      { id: 4, theme: "Identificação visual", label: "Ruim" },
      { id: 5, theme: "Conservação de equipamentos", label: "Bom" },
      { id: 6, theme: "Limpeza de áreas de difícil acesso", label: "Bom" },
      { id: 7, theme: "Controle de odores e pragas", label: "Ruim" },
      { id: 8, theme: "Conformidade com os procedimentos padrão", label: "Ótimo" },

    ];

    return (
      <TableRow key={task.id} className="hover:bg-muted/50">

        <TableCell className="h-16 px-4 text-sm text-muted-foreground">
          {task.setor}
        </TableCell>

        <TableCell className="h-16 px-4 text-sm text-muted-foreground text-center">
          {task.cargo}
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
                    aria-label={`Ver detalhes de ${task.setor}`}
                  >
                    <EyeIcon color="white" className="size-5" />

                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className=" w-250 h-70 p-5 ">

                  <PopoverHeader>
                    <div className=" flex justify-between ">
                      <div>
                        <PopoverTitle className={" font-bold text-3xl "}>{task.setor}</PopoverTitle>
                      </div>
                      <div>
                        <p>
                          <span className=" font-bold text-3xl">{hasVistoria ? task.nota : "Sem vistoria"}</span>
                        </p>
                      </div>
                    </div>
                  </PopoverHeader>

                  <div className="space-y-2 text-xl">
                    <p>
                      <span className=" font-bold ">Status:</span>{" "}
                      {task.status}
                    </p>

                    <p className=" mb-0 font-bold ">Respostas:</p>
                    <div className=" flex-col justify-between ">
                      <div className=" flex mb-6 ">
                        {respostas.slice(0, 4).map((resposta) => (
                          <div key={resposta.id} className=" text-lg flex-col ">
                            <span className=" font-bold ">{resposta.theme + ": " }</span>
                            {resposta.label + " "}
                          </div>
                        ))}
                      </div>
                      <div className=" flex ">
                        {respostas.slice(4).map((resposta) => (
                          <div key={resposta.id} className=" text-lg flex-col ">
                            <span className=" font-bold ">{resposta.theme + ": "}</span>
                            {resposta.label + " "}
                          </div>
                        ))}
                      </div>
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
                    aria-label={`Excluir checklist de ${task.setor}`}
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

                    <PopoverTitle>Confirmar Exclusão</PopoverTitle>

                    <PopoverDescription>
                      Tem certeza que deseja excluir o checklist do setor "{task.setor}"?
                    </PopoverDescription>

                  </PopoverHeader>

                  <div className="flex justify-end gap-2 mt-4">

                    <Button
                      variant="outline"
                      onClick={() => { }}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(task)}
                      disabled={deletePending}>

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






  return (
    <div className="w-full max-w-6xl rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="h-12 px-6 font-medium">Setor</TableHead>
            <TableHead className="h-12 px-4 font-medium text-center">
              Nota do Dia
            </TableHead>
            <TableHead className="h-12 px-6 text-right font-medium pe-10">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                Nenhum checklist encontrado.
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map(renderTaskRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}