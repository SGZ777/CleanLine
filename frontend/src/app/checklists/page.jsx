"use client";

import {
  EyeIcon,
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

// Função para definir a cor da nota
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

    return (
      <TableRow key={task.id} className="hover:bg-muted/50">
        <TableCell className={`h-16 px-4 text-sm ${setorColorClass}`}>
          {task.setor}
        </TableCell>
        <TableCell className="h-16 px-4 text-sm text-center">
          {hasVistoria ? (
            <span className={getNotaColor(task.nota)}>{task.nota}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
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
                    aria-label={`Ver detalhes de ${task.setor}`}
                  >
                    <EyeIcon color="white" className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>{task.setor}</PopoverTitle>
                    <PopoverDescription>Detalhes do checklist</PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Setor:</span> {task.setor}
                    </p>
                    <p>
                      <span className="font-medium">Nota do dia:</span>{" "}
                      {hasVistoria ? task.nota : "Sem vistoria"}
                    </p>
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