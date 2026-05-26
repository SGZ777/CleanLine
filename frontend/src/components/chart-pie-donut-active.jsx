"use client";

import { useEffect, useMemo, useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { getDistribuicaoNotasEquipes } from "@/lib/controllers/dashboard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const title = "Distribuicao de notas das equipes";

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

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await getDistribuicaoNotasEquipes();
        setDados(response || []);
      } catch (err) {
        console.error("Erro ao carregar distribuicao de notas:", err);
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
        Carregando graficos...
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
      <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipesGraficos.map(({ equipe, total, activeIndex, chartData }) => (
          <div
            key={equipe}
            className="w-full max-w-xs rounded-md border bg-background p-4"
          >
            <ChartContainer
              className="mx-auto aspect-square max-h-[250px]"
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

            <h2 className="mt-3 truncate text-center text-base font-medium text-foreground">
              {equipe}
            </h2>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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
  );
};

export default ChartPieDonutActive;
