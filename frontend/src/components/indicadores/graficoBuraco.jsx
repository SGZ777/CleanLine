"use client";

import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { getDistribuicaoNotasEquipes } from "@/lib/controllers/dashboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, TableProperties } from "lucide-react";

export const title = "Distribuição de notas das equipes";

const FAIXAS = [
  { faixa: "0-4", label: "0 - 4", fill: "#ff4d4d" },
  { faixa: "4.1-6.9", label: "4,1 - 6,9", fill: "#ffcc00" },
  { faixa: "7-10", label: "7 - 10", fill: "#4caf50" },
];

const chartConfig = {
  quantidade: {
    label: "Vistorias",
  },
};

function montarGraficos(dados) {
  const equipes = new Map();

  dados.forEach(({ equipe, faixa, quantidade }) => {
    if (!equipes.has(equipe)) {
      equipes.set(equipe, {
        equipe,
        total: 0,
        chartData: FAIXAS.map((item) => ({ ...item, quantidade: 0 })),
      });
    }

    const grafico = equipes.get(equipe);
    const item = grafico.chartData.find((x) => x.faixa === faixa);
    const valor = Number(quantidade) || 0;

    if (item) {
      item.quantidade = valor;
      grafico.total += valor;
    }
  });

  return Array.from(equipes.values()).map((grafico) => ({
    ...grafico,
    activeIndex: Math.max(
      grafico.chartData.findIndex((item) => item.quantidade > 0),
      0
    ),
    chartData:
      grafico.total > 0
        ? grafico.chartData
        : [{ faixa: "sem-dados", label: "Sem dados", quantidade: 1, fill: "var(--muted)" }],
  }));
}

const ChartPieDonutActive = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("chart"); // "chart" | "table"

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await getDistribuicaoNotasEquipes();
        setDados(response || []);
      } catch (err) {
        console.error("Erro ao carregar distribuição de notas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const equipesGraficos = useMemo(() => montarGraficos(dados), [dados]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando gráficos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  if (equipesGraficos.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma equipe cadastrada.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Selector premium de visualização */}
      <div className="mb-6 flex justify-end gap-2 pr-2">
        <button
          onClick={() => setViewMode("chart")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            viewMode === "chart"
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          Gráfico
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            viewMode === "table"
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <TableProperties className="h-4 w-4" />
          Tabela
        </button>
      </div>

      <div className="w-full transition-all duration-300">
        {viewMode === "chart" ? (
          <div className="animate-fade-in-up">
            <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipesGraficos.map(({ equipe, total, activeIndex, chartData }, idx) => (
                <div
                  key={equipe}
                  className="w-full max-w-xs rounded-md animate-spin-in"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <ChartContainer
                    className="mx-auto aspect-square max-h-62.5"
                    config={chartConfig}
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            hideLabel
                            nameKey="label"
                            formatter={(value, name) => (
                              <>
                                <span className="text-muted-foreground">{name}</span>
                                <span className="ml-auto font-mono font-medium text-foreground">
                                  {Number(value)}
                                </span>
                              </>
                            )}
                          />
                        }
                        cursor={false}
                      />
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={({ outerRadius = 0, ...props }) => (
                          <Sector {...props} outerRadius={outerRadius + 10} />
                        )}
                        data={chartData}
                        dataKey="quantidade"
                        innerRadius={60}
                        nameKey="label"
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                              return null;
                            }

                            return (
                              <text
                                dominantBaseline="middle"
                                textAnchor="middle"
                                x={viewBox.cx}
                                y={viewBox.cy}
                              >
                                <tspan
                                  className="fill-foreground text-2xl font-bold"
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                >
                                  {total}
                                </tspan>
                                <tspan
                                  className="fill-muted-foreground text-xs"
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 20}
                                >
                                  vistorias
                                </tspan>
                              </text>
                            );
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <h2 className="truncate text-center text-base font-medium text-foreground">
                    {equipe}
                  </h2>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center mb-10 gap-4 text-sm text-muted-foreground">
              {FAIXAS.map(({ faixa, label, fill }) => (
                <div key={faixa} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: fill }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up overflow-hidden rounded-xl border border-border shadow-md bg-card text-card-foreground">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-foreground px-6 py-4">Equipe</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-4 text-center">0 - 4 (Insatisfatório)</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-4 text-center">4,1 - 6,9 (Regular)</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-4 text-center">7 - 10 (Excelente)</TableHead>
                  <TableHead className="font-semibold text-foreground px-6 py-4 text-center">Total Vistorias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipesGraficos.map(({ equipe, total, chartData }, index) => {
                  const getFaixaVal = (fKey) => {
                    const item = chartData.find((x) => x.faixa === fKey);
                    return item ? item.quantidade : 0;
                  };

                  const valRed = getFaixaVal("0-4");
                  const valYellow = getFaixaVal("4.1-6.9");
                  const valGreen = getFaixaVal("7-10");

                  return (
                    <TableRow
                      key={equipe}
                      className="hover-row-effect animate-fade-in-left"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <TableCell className="font-semibold text-foreground px-6 py-4">{equipe}</TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={valRed > 0 ? "text-red-500 font-medium dark:text-red-400" : "text-muted-foreground/50"}>
                          {valRed}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={valYellow > 0 ? "text-yellow-600 font-medium dark:text-yellow-500" : "text-muted-foreground/50"}>
                          {valYellow}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={valGreen > 0 ? "text-green-500 font-medium dark:text-green-400" : "text-muted-foreground/50"}>
                          {valGreen}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center font-bold text-foreground">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartPieDonutActive;
