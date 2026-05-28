"use client";

import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { getDistribuicaoNotasEquipes } from "@/lib/controllers/dashboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  const [tableKey, setTableKey] = useState(0);

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

  const handleViewMode = (mode) => {
    setViewMode(mode);
    if (mode === "table") {
      setTableKey((k) => k + 1);
    }
  };

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
          onClick={() => handleViewMode("chart")}
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
          onClick={() => handleViewMode("table")}
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
              {equipesGraficos.map(({ equipe, total, activeIndex, chartData }) => (
                <div
                  key={equipe}
                  className="w-full max-w-xs rounded-md"
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
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationBegin={200}
                        startAngle={90}
                        endAngle={-270}
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
          <div
            key={tableKey}
            className="animate-fade-in-up w-full overflow-x-auto rounded-xl border border-border shadow-md bg-card text-card-foreground"
          >
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-border/70 bg-muted/40">
                  <th className="h-10 px-4 py-4 text-left align-middle font-semibold text-foreground whitespace-nowrap min-w-[120px]">
                    Equipe
                  </th>
                  <th className="h-10 px-4 py-4 text-center align-middle font-semibold text-foreground whitespace-nowrap min-w-[80px]">
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="text-red-500 dark:text-red-400">0 – 4</span>
                      <span className="text-xs font-normal text-muted-foreground">Insatisfatório</span>
                    </span>
                  </th>
                  <th className="h-10 px-4 py-4 text-center align-middle font-semibold text-foreground whitespace-nowrap min-w-[80px]">
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="text-yellow-600 dark:text-yellow-500">4,1 – 6,9</span>
                      <span className="text-xs font-normal text-muted-foreground">Regular</span>
                    </span>
                  </th>
                  <th className="h-10 px-4 py-4 text-center align-middle font-semibold text-foreground whitespace-nowrap min-w-[80px]">
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="text-green-500 dark:text-green-400">7 – 10</span>
                      <span className="text-xs font-normal text-muted-foreground">Excelente</span>
                    </span>
                  </th>
                  <th className="h-10 px-4 py-4 text-center align-middle font-semibold text-foreground whitespace-nowrap min-w-[90px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {equipesGraficos.map(({ equipe, total, chartData }, index) => {
                  const getFaixaVal = (fKey) => {
                    const item = chartData.find((x) => x.faixa === fKey);
                    return item ? item.quantidade : 0;
                  };

                  const valRed = getFaixaVal("0-4");
                  const valYellow = getFaixaVal("4.1-6.9");
                  const valGreen = getFaixaVal("7-10");

                  return (
                    <tr
                      key={equipe}
                      className="table-row-animated border-b border-border/70 even:bg-muted/35"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <td className="px-4 py-4 align-middle font-semibold text-foreground whitespace-nowrap">
                        {equipe}
                      </td>
                      <td className="px-4 py-4 align-middle text-center whitespace-nowrap">
                        <span className={valRed > 0 ? "text-red-500 font-medium dark:text-red-400" : "text-muted-foreground/50"}>
                          {valRed}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle text-center whitespace-nowrap">
                        <span className={valYellow > 0 ? "text-yellow-600 font-medium dark:text-yellow-500" : "text-muted-foreground/50"}>
                          {valYellow}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle text-center whitespace-nowrap">
                        <span className={valGreen > 0 ? "text-green-500 font-medium dark:text-green-400" : "text-muted-foreground/50"}>
                          {valGreen}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle text-center whitespace-nowrap font-bold text-foreground">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartPieDonutActive;
