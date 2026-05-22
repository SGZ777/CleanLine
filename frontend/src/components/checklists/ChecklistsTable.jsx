"use client";

import { ClipboardCheckIcon, EyeIcon, ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpandableImage from "./ImageExpandsChecklist";

const PERGUNTAS = [
  "Organizacao do ambiente",
  "Limpeza de superficies",
  "Descarte de residuos",
  "Identificacao visual",
  "Conservacao de equipamentos",
  "Limpeza de areas de dificil acesso",
  "Controle de odores e pragas",
  "Conformidade com os procedimentos padrao",
];

const getNotaColor = (nota) => {
  if (nota === null || nota === undefined) return "text-muted-foreground";
  const valor = Number(nota);
  if (valor >= 8) return "text-green-600 font-semibold dark:text-green-400";
  if (valor >= 6) return "text-yellow-600 font-semibold dark:text-yellow-300";
  return "text-red-500 font-semibold dark:text-red-400";
};

const getNotaBadgeClass = (nota) => {
  if (nota === null || nota === undefined) {
    return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300";
  }

  const valor = Number(nota);
  if (valor >= 8) {
    return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300";
  }
  if (valor >= 6) {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
  }
  return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300";
};

const capitalize = (value) => {
  const text = String(value ?? "-");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function ChecklistsTable({ tasks = [], searchTerm = "" }) {
  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      task.setor?.toLowerCase().includes(term) ||
      (task.nota !== null && task.nota?.toString().includes(term))
    );
  });

  const renderTaskCard = (task) => {
    const hasVistoria = task.nota !== null && task.nota !== undefined;
    const setorColorClass = hasVistoria
      ? "text-green-600 dark:text-green-400"
      : "text-red-500 dark:text-red-400";

    const respostas = [];
    for (let i = 1; i <= 8; i++) {
      const chave = `q${i}`;
      respostas.push({
        id: i,
        theme: PERGUNTAS[i - 1],
        label: task[chave] ?? "-",
      });
    }

    const imagemSrc =
      task.imagem &&
      typeof task.imagem === "string" &&
      task.imagem.startsWith("http")
        ? task.imagem
        : "/placeholder.jpg";

    return (
      <Card
        key={task.id ?? task.setor}
        className="border shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
      >
        <CardHeader className="gap-2">
          <CardTitle className={`truncate pr-2 ${setorColorClass}`}>
            {task.setor}
          </CardTitle>
          <CardDescription>Checklist do dia</CardDescription>
          <CardAction>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`Ver detalhes de ${task.setor}`}
                >
                  <EyeIcon className="size-5 text-white" />
                </Button>
              </DialogTrigger>

              <DialogContent
                className="max-h-[90vh] overflow-y-auto p-5 sm:max-w-5xl"
                overlayClassName="bg-black/60 backdrop-blur-sm"
              >
                <DialogHeader>
                  <div className="flex flex-col gap-2 mt-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
                    <DialogTitle className="text-2xl font-bold">
                      {task.setor}
                    </DialogTitle>
                    <p className="text-3xl font-bold">
                      Nota: {hasVistoria ? task.nota : "Sem vistoria"}
                    </p>
                  </div>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                  <ExpandableImage
                    src={imagemSrc}
                    alt={`Foto do setor ${task.setor}`}
                    width={120}
                    height={140}
                  />

                  <p className="font-bold">Respostas:</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {respostas.map((resposta) => (
                      <div
                        key={resposta.id}
                        className="rounded-lg border bg-muted/35 p-3"
                      >
                        <span className="block text-sm font-bold">
                          {resposta.theme}
                        </span>
                        <span className="text-muted-foreground">
                          {capitalize(resposta.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <ClipboardCheckIcon className="size-4" />
                <span className="text-xs font-medium uppercase">Nota</span>
              </div>
              {hasVistoria ? (
                <p className={getNotaColor(task.nota)}>{task.nota}</p>
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
            </div>
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <ImageIcon className="size-4" />
                <span className="text-xs font-medium uppercase">Imagem</span>
              </div>
              <p className="text-sm font-medium">
                {task.imagem ? "Disponivel" : "Pendente"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Status
            </p>
            <p className="text-card-foreground">
              {hasVistoria
                ? "Vistoria registrada para este setor."
                : "Ainda sem vistoria registrada hoje."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Badge variant="outline" className={getNotaBadgeClass(task.nota)}>
            {hasVistoria ? `Nota ${task.nota}` : "Sem vistoria"}
          </Badge>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Nenhum checklist encontrado.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {filteredTasks.map(renderTaskCard)}
        </div>
      )}
    </div>
  );
}
