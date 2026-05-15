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

const MONTH_COLORS = ["#00afdc", "#2ad7eb", "#0d005d"];

const SimpleBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [meses, setMeses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
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
