"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getGraficoPontuacaoMensal } from "@/lib/controllers/dashboard";

const chartConfig = {
  media: {
    label: "Media Diaria",
    color: "hsl(var(--chart-1))",
  },
};
// Formata a nota 
function formatNota(value) {
  const notaNumerica = Number(value) || 0;
  const notaArredondada = Math.round(notaNumerica * 10) / 10;

  if (notaArredondada >= 10) {
    return "10";
  }

  return notaArredondada.toFixed(1);
}

export function PontuacaoGrafico() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const json = await getGraficoPontuacaoMensal();
        if (json.dados) {
          setChartData(json.dados);
        } else {
          console.error("Formato inesperado:", json);
        }
      } catch (error) {
        console.error("Erro ao carregar grafico:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const mediaTotal = React.useMemo(() => {
    if (!chartData.length) return "0";
    let soma = 0;
    let count = 0;
    chartData.forEach((item) => {
      const val = parseFloat(item.media);
      if (!isNaN(val)) {
        soma += val;
        count++;
      }
    });
    return count > 0 ? formatNota(soma / count) : "0";
  }, [chartData]);

  if (loading) {
    return (
      <Card className="w-full max-w-230 bg-white shadow-md">
        <CardContent className="p-6 text-center">
          Carregando dados do grafico...
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="w-full max-w-230 bg-white shadow-md">
        <CardContent className="p-6 text-center">
          Nenhum dado disponivel para o mes atual.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-230 bg-white shadow-md overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle>
          Média de pontuacao 5S -{" "}
          {new Date().toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Média geral: {mediaTotal}
        </div>
      </CardHeader>
      <CardContent className="px-2 py-3 sm:px-3 sm:py-2 overflow-visible">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full overflow-visible"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (!value) return "";
                const date = new Date(value);
                if (isNaN(date.getTime())) return value;
                return date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-37.5 z-9999 rounded border bg-white shadow-lg"
                  nameKey="views"
                  labelFormatter={(value) => {
                    if (!value) return "";
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return value;
                    return date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => [`${value} pontos`, " ", "média"]}
                />
              }
            />
            <Bar
              dataKey="media"
              fill="var(--color-media)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
