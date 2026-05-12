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
import ExpandableImage from "./ImageExpandsChecklist";

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

                <PopoverContent  className=" w-255 h-115 p-5 " avoidCollisions={true} collisionPadding={20} align="end" side="bottom">

                  <PopoverHeader>
                    <div className=" flex justify-between ">
                      <div>
                        <PopoverTitle className={" font-bold text-3xl "}>{task.setor}</PopoverTitle>
                      </div>
                      <div>
                        <p>
                          <span className=" font-bold text-3xl">Nota: {hasVistoria ? task.nota : "Sem vistoria"}</span>
                        </p>
                      </div>
                    </div>
                  </PopoverHeader>

                  <div className="space-y-2 text-xl">

                    <ExpandableImage
                      src="data:image/jpeg;base64,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"
                      alt="Descrição da imagem"
                      width={120}
                      height={140}
                    />

                    <p className=" mb-0 mt-4 font-bold ">Respostas:</p>
                    <div className=" flex-col justify-between ">
                      <div className=" flex mb-6 ">
                        {respostas.slice(0, 4).map((resposta) => (
                          <div key={resposta.id} className=" text-lg flex flex-col w-1/4 ">
                            <span className=" font-bold ">{resposta.theme + ": "}</span>
                            {resposta.label + " "}
                          </div>
                        ))}
                      </div>
                      <div className=" flex ">
                        {respostas.slice(4).map((resposta) => (
                          <div key={resposta.id} className=" text-lg flex flex-col w-1/4 ">
                            <span className=" font-bold ">{resposta.theme + ": "}</span>
                            {resposta.label + " "}
                          </div>
                        ))}
                      </div>
                    </div>

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