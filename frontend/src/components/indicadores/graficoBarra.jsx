"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getGraficoSetoresMensal } from "@/lib/controllers/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, TableProperties } from "lucide-react";

const MONTH_COLORS = ["#00afdc", "#2ad7eb", "#0d005d"];

const getNotaStyle = (val) => {
  const num = Number(val);
  if (num >= 8.0) return "text-green-500 font-semibold dark:text-green-400";
  if (num >= 6.0) return "text-yellow-600 font-semibold dark:text-yellow-500";
  return "text-destructive font-semibold";
};


const SimpleBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [meses, setMeses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("chart"); // "chart" | "table"
  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      try {
        const { dados } = await getGraficoSetoresMensal();

        if (!dados || dados.length === 0) {
          setChartData([]);
          setMeses([]);
          return;
        }

        const mesesUnicos = [...new Set(dados.map((d) => d.mes))].sort(
          (a, b) => new Date(a) - new Date(b)
        );

        setMeses(mesesUnicos);

        const pivot = {};

        dados.forEach(({ setor, mes, media }) => {
          if (!pivot[setor]) {
            pivot[setor] = { name: setor };

            mesesUnicos.forEach((m) => {
              pivot[setor][m] = 0;
            });
          }

          pivot[setor][mes] = Number(media);
        });

        setChartData(Object.values(pivot));
      } catch (err) {
        console.error("Erro ao carregar gráfico:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleViewMode = (mode) => {
    setViewMode(mode);
    if (mode === "table") {
      // Reinicia a key para forçar re-render e disparar animações
      setTableKey((k) => k + 1);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando gráfico...
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

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum dado disponível.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
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
            <ResponsiveContainer width="100%" aspect={1.618} maxHeight={350}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width={30} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                <Tooltip />
                <Legend className="m-20" content={<CustomLegend meses={meses} />} />

                {meses.map((mes, index) => (
                  <Bar
                    key={mes}
                    dataKey={mes}
                    fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                    radius={[5, 5, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
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
                    Setor
                  </th>
                  {meses.map((mes) => (
                    <th
                      key={mes}
                      className="h-10 px-4 py-4 text-center align-middle font-semibold text-foreground whitespace-nowrap min-w-[100px]"
                    >
                      {formatMes(mes)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {chartData.map((row, index) => (
                  <tr
                    key={row.name}
                    className="table-row-animated border-b border-border/70 even:bg-muted/35"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <td className="px-4 py-4 align-middle font-medium text-foreground whitespace-nowrap">
                      {row.name}
                    </td>
                    {meses.map((mes) => {
                      const val = row[mes];
                      return (
                        <td key={mes} className="px-4 py-4 align-middle text-center whitespace-nowrap">
                          {val !== undefined && val !== null ? (
                            <span className={getNotaStyle(val)}>
                              {Number(val).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

function formatMes(mesStr) {
  const [ano, mes] = mesStr.split("-");
  const data = new Date(ano, mes - 1);

  return data.toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

function CustomLegend({ meses }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        marginTop: 10,
        flexWrap: "wrap",
      }}
    >
      {meses.map((mes, index) => (
        <div
          key={mes}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: MONTH_COLORS[index % MONTH_COLORS.length],
              borderRadius: 2,
            }}
          />
          <span>{formatMes(mes)}</span>
        </div>
      ))}
    </div>
  );
}

export default SimpleBarChart;
