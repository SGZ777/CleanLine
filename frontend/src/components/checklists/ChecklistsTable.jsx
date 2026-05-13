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

// Perguntas fixas (ordem igual às colunas q1..q8)
const PERGUNTAS = [
  "Organização do ambiente",
  "Limpeza de superfícies",
  "Descarte de resíduos",
  "Identificação visual",
  "Conservação de equipamentos",
  "Limpeza de áreas de difícil acesso",
  "Controle de odores e pragas",
  "Conformidade com os procedimentos padrão",
];

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

    // Monta array de respostas reais (q1..q8) – mantendo o mesmo layout
    const respostas = [];
    for (let i = 1; i <= 8; i++) {
      const chave = `q${i}`;
      respostas.push({
        id: i,
        theme: PERGUNTAS[i - 1],
        label: task[chave] ?? "—",
      });
    }

    // URL da imagem (usa placeholder se não houver)
    const imagemSrc = task.imagem || "/placeholder.jpg";

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
                      src={imagemSrc}
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

              {/* Botão de exclusão mantido conforme design original */}
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
                      onClick={() => {}}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(task)}
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