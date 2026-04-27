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

// Cores para as barras (pode expandir se tiver mais meses)
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
        } else {
          // Extrai os meses únicos ordenados (formato "YYYY-MM")
          const mesesUnicos = [...new Set(dados.map(d => d.mes))].sort();
          setMeses(mesesUnicos);

          // Pivoteia os dados: cada setor vira um objeto { name, [mes1]: media, [mes2]: media, ... }
          const pivot = {};
          dados.forEach(({ setor, mes, media }) => {
            if (!pivot[setor]) {
              pivot[setor] = { name: setor };
              // Inicializa todos os meses com 0 (ou null para não exibir barra)
              mesesUnicos.forEach(m => (pivot[setor][m] = 0));
            }
            pivot[setor][mes] = Number(media);
          });

          setChartData(Object.values(pivot));
        }
      } catch (err) {
        console.error("Erro ao carregar gráfico de setores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando gráfico...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar dados: {error}</div>;
  }

  if (chartData.length === 0) {
    return <div className="p-8 text-center text-gray-500">Nenhum dado disponível para os últimos meses.</div>;
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
          <Legend />
          {meses.map((mes, index) => (
            <Bar
              key={mes}
              dataKey={mes}
              fill={MONTH_COLORS[index % MONTH_COLORS.length]}
              radius={[5, 5, 0, 0]}
              name={formatMes(mes)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper para exibir o mês de forma legível (ex: "2026-04" -> "Abr 2026")
function formatMes(mesStr) {
  const [ano, mes] = mesStr.split("-");
  const data = new Date(ano, mes - 1);
  return data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export default SimpleBarChart;