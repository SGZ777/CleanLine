"use client";

import {
  CheckCircle,
  EyeIcon,
  Loader2,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tasks = [
  {
    id: "TASK-001",
    setor: "Logística",
    cargo: "Supervisor",
  },
  {
    id: "TASK-002",
    setor: "TI",
    cargo: "Gerente",
  },
  {
    id: "TASK-003",
    setor: "RH",
    cargo: "Supervisor",
  },
  {
    id: "TASK-004",
    setor: "Usinagem",
    cargo: "Funcionario",
  },
  {
    id: "TASK-005",
    setor: "Manutenção",
    cargo: "Funcionario",
  },
];

export default function ChecklistsTable() {
  const [pendingAction, setPendingAction] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    setor: "",
    cargo: "",
  });

  const isTaskActionPending = (action, taskId) =>
    pendingAction?.id === taskId && pendingAction.type === action;

  const isTaskBusy = (taskId) => pendingAction?.id === taskId;

  const handleAction = (task, actionType) => {
    setPendingAction({ id: task.id, type: actionType });
    setTimeout(() => {
      setPendingAction(null);
      console.log(`Action "${actionType}" completed for task:`, task.setor);
    }, 1000);
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      setor: task.setor,
      cargo: task.cargo,
    });
  };

  const handleSaveEdit = () => {
    setPendingAction({ id: editingTask, type: "edit" });
    setTimeout(() => {
      setPendingAction(null);
      setEditingTask(null);
      console.log("Edit completed for task:", editingTask);
    }, 1000);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDelete = (task) => {
    setPendingAction({ id: task.id, type: "delete" });
    setTimeout(() => {
      setPendingAction(null);
      console.log("Delete completed for task:", task.setor);
    }, 1000);
  };

  const renderTaskRow = (task) => {
    const busy = isTaskBusy(task.id);
    const startPending = isTaskActionPending("start", task.id);
    const pausePending = isTaskActionPending("pause", task.id);
    const completePending = isTaskActionPending("complete", task.id);
    const deletePending = isTaskActionPending("delete", task.id);

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
              {(task.status === "pending" || task.status === "blocked") && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAction(task, "start")}
                      disabled={busy}
                      aria-label="Start"
                    >
                      {startPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <PlayIcon className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              )}

              {task.status === "in-progress" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAction(task, "pause")}
                        disabled={busy}
                        aria-label="Pause"
                      >
                        {pausePending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <PauseIcon className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAction(task, "complete")}
                        disabled={busy}
                        aria-label="Complete"
                      >
                        {completePending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <CheckCircle className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </Tooltip>
                </>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={busy}
                    aria-label={`Ver detalhes de ${task.name}`}
                  >
                    <EyeIcon color="white" className="size-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <PopoverHeader>
                    <PopoverTitle>{task.name}</PopoverTitle>
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
                    aria-label="Excluir funcionário"
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
                      Tem certeza que deseja excluir o funcionário "{task.name}"?
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
            <TableHead className="h-12 px-4 font-medium text-center">Última atualização</TableHead>
            <TableHead className="h-12 px-6 text-right font-medium pe-10">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{tasks.map(renderTaskRow)}</TableBody>
      </Table>
    </div>
  );
}
