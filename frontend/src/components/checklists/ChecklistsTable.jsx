"use client";

import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
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
  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      task.setor?.toLowerCase().includes(term) ||
      (task.nota !== null && task.nota.toString().includes(term)) ||
      task.id?.toString().includes(term)
    );
  });



  const renderTaskRow = (task) => {
    const hasVistoria = task.nota !== null && task.nota !== undefined;
    const setorColorClass = hasVistoria ? "text-green-600" : "text-red-500";

    // Monta array de respostas reais (q1..q8)
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
    const imagemSrc = (task.imagem && typeof task.imagem === 'string' && task.imagem.startsWith('http'))
      ? task.imagem
      : '/placeholder.jpg';
    // console.log("tasks:", tasks);
    // console.log("filteredTasks:", filteredTasks);

    return (
      <TableRow key={task.id} className="hover:bg-muted/50">
        {/* Nome do setor com cor dinâmica */}
        <TableCell className={`h-16 px-4 text-sm ${setorColorClass}`}>
          {task.setor}
        </TableCell>

        {/* Nota do dia com cor baseada na faixa */}
        <TableCell className="h-16 px-4 text-sm text-center">
          {hasVistoria ? (
            <span className={getNotaColor(task.nota)}>{task.nota}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </TableCell>

        {/* Ações (apenas ícone de visualização) */}
        <TableCell className="h-16 px-6">
          <TooltipProvider>
            <div className="flex items-center justify-end gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Ver detalhes de ${task.setor}`}
                  >
                    <EyeIcon className="size-5 text-white" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className=" sm:w-1/1 sm:h-4/5 md:w-255 md:h-115 p-5"
                  avoidCollisions={true}
                  collisionPadding={20}
                  align="end"
                  side="bottom"
                >
                  <PopoverHeader>
                    <div className="flex justify-between">
                      <div>
                        <PopoverTitle className="font-bold text-3xl">
                          {task.setor}
                        </PopoverTitle>
                      </div>
                      <div>
                        <p>
                          <span className="font-bold text-3xl">
                            Nota: {hasVistoria ? task.nota : "Sem vistoria"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </PopoverHeader>

                  <div className="space-y-2 text-xl">
                    <ExpandableImage
                      src={imagemSrc}
                      alt={`Foto do setor ${task.setor}`}
                      width={120}
                      height={140}
                    />

                    <p className="mb-0 mt-4 font-bold">Respostas:</p>
                    <div className="flex-col justify-between">
                      <div className="flex mb-6">
                        {respostas.slice(0, 4).map((resposta) => (
                          <div
                            key={resposta.id}
                            className="text-lg flex flex-col w-1/4"
                          >
                            <span className="font-bold">
                              {resposta.theme + ": "}
                            </span>
                            {String(resposta.label).charAt(0).toUpperCase() + String(resposta.label).slice(1)}
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        {respostas.slice(4).map((resposta) => (
                          <div
                            key={resposta.id}
                            className="text-lg flex flex-col w-1/4"
                          >
                            <span className="font-bold">
                              {resposta.theme + ": "}
                            </span>
                            {String(resposta.label).charAt(0).toUpperCase() + String(resposta.label).slice(1)}
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
              <TableCell
                colSpan={3}
                className="py-6 text-center text-muted-foreground"
              >
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
