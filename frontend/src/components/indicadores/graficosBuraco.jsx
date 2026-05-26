"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip,
} from "recharts";
import { getDistribuicaoNotasEquipes } from "@/lib/controllers/dashboard";

// Mapeamento fixo de cores por faixa
const CORES = {
  "0-4": "#ff4d4d",      // vermelho
  "4.1-6.9": "#ffcc00", // amarelo
  "7-10": "#4caf50",    // verde
};

// Ordem desejada das faixas (para consistência)
const ORDEM_FAIXAS = ["0-4", "4.1-6.9", "7-10"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const { name, value, percent } = payload[0].payload;

  return (
    <div className="rounded border bg-background px-3 py-2 text-sm shadow">
      <p className="font-semibold">Faixa: {name}</p>
      <p>Quantidade: {value}</p>
      <p>Porcentagem: {percent.toFixed(1)}%</p>
    </div>
  );
}

export default function PieChartInFlexbox() {
  const [equipesGraficos, setEquipesGraficos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getDistribuicaoNotasEquipes();
        // Agrupar por equipe
        const mapa = {};
        dados.forEach(({ equipe, faixa, quantidade }) => {
          if (!mapa[equipe]) {
            mapa[equipe] = { equipe, faixas: [] };
          }
          mapa[equipe].faixas.push({
            faixa,
            quantidade,
            cor: CORES[faixa] || "#cccccc",
          });
        });

        // Para cada equipe, completar faixas faltantes com zero e ordenar
        const graficos = Object.values(mapa).map((g) => {
          const faixasCompletas = ORDEM_FAIXAS.map((f) => {
            const existente = g.faixas.find((x) => x.faixa === f);
            return {
              name: f,
              value: existente ? existente.quantidade : 0,
              fill: CORES[f],
            };
          });

          const total = faixasCompletas.reduce(
            (soma, faixa) => soma + faixa.value,
            0
          );

          const faixasComPorcentagem = faixasCompletas.map((faixa) => ({
            ...faixa,
            percent: total > 0 ? (faixa.value / total) * 100 : 0,
          }));

          return { equipe: g.equipe, dados: faixasComPorcentagem };
        });

        setEquipesGraficos(graficos);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return <div className="mt-8 text-center">Carregando gráficos...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">Erro: {error}</div>;
  }

  if (equipesGraficos.length === 0) {
    return <div className="mt-8 text-center">Nenhum dado disponível.</div>;
  }

  return (

    <div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          minHeight: "300px",
          padding: "10px",
          paddingTop: "0",
          justifyContent: "space-around",
          alignItems: "stretch",
          gap: "20px",
        }}>

        {equipesGraficos.map(({ equipe, dados }, idx) => (
          <div
            key={equipe}
            className=" md:w-1/3 w-1/1 "
            style={{
              maxWidth: "300px",
              textAlign: "center",
            }}>
            <ResponsiveContainer width="100%" aspect={1}>
              <PieChart>
                <Pie
                  data={dados}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="80%"
                  innerRadius="60%"
                  isAnimationActive={false}
                >
                  {dados.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Label
                  position="center"
                  fill="var(--foreground)"
                  fontSize={14}
                  fontWeight="bold"
                >
                  {equipe}
                </Label>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
        {/* Legenda global das faixas */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 10 }}>
          {ORDEM_FAIXAS.map((faixa) => (
            <div key={faixa} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, backgroundColor: CORES[faixa], borderRadius: 2 }} />
              <span style={{ fontSize: 14 }}>{faixa}</span>
            </div>
          ))}
        </div>
    </div>
  );
}

