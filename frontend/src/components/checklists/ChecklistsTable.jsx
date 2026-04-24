"use client";

import {
  EyeIcon,
  Loader2,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { INITIAL_CHECKLISTS } from "@/components/checklists/checklistData";
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
import {
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function ChecklistsTable({ tasks = INITIAL_CHECKLISTS }) {
  const [pendingAction, setPendingAction] = useState(null);

  const isTaskBusy = (taskId) => pendingAction?.id === taskId;

  const handleDelete = (task) => {
    setPendingAction({ id: task.id, type: "delete" });
    setTimeout(() => {
      setPendingAction(null);
      console.log("Delete completed for task:", task.setor);
    }, 1000);
  };

  const renderTaskRow = (task) => {
    const busy = isTaskBusy(task.id);
    const deletePending =
      pendingAction?.id === task.id && pendingAction.type === "delete";

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
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>{task.setor}</PopoverTitle>
                    <PopoverDescription>{task.cargo}</PopoverDescription>
                  </PopoverHeader>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Setor:</span> {task.setor}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {task.status}
                    </p>
                    <p className="text-muted-foreground">{task.notes}</p>
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
                    <PopoverTitle>Confirmar Exclusao</PopoverTitle>
                    <PopoverDescription>
                      Tem certeza que deseja excluir o checklist do setor "{task.setor}"?
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" className="bg-transparent ring-1" onClick={() => {}}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-transparent ring-1"
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
            <TableHead className="h-12 px-4 font-medium text-center">Cargo</TableHead>
            <TableHead className="h-12 px-6 text-right font-medium pe-10">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                Nenhum checklist encontrado.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map(renderTaskRow)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
