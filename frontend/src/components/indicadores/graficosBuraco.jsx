"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from "recharts";
import { getDistribuicaoNotasEquipes } from "@/lib/controllers/dashboard";

// Mapeamento fixo de cores por faixa
const CORES = {
  "0-4": "#ff4d4d",      // vermelho
  "4.1-6.9": "#ffcc00", // amarelo
  "7-10": "#4caf50",    // verde
};

// Ordem desejada das faixas (para consistência)
const ORDEM_FAIXAS = ["0-4", "4.1-6.9", "7-10"];

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
          return { equipe: g.equipe, dados: faixasCompletas };
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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        minHeight: "300px",
        padding: "10px",
        justifyContent: "space-around",
        alignItems: "stretch",
        gap: "20px",
      }}
    >
      {equipesGraficos.map(({ equipe, dados }, idx) => (
        <div
          key={equipe}
          style={{
            width: "33%",
            maxWidth: "300px",
            textAlign: "center",
          }}
        >
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
              <Label
                position="center"
                fill="#666"
                fontSize={14}
                fontWeight="bold"
              >
                {equipe}
              </Label>
            </PieChart>
            <Legend content={<CustomLegend equipes={equipes} />} />
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ equipes }) {
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
      {equipes.map((equipe, index) => (
        <div
          key={equipe}
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
              backgroundColor:
                CORES[index % CORES.length],
              borderRadius: 2,
            }}
          />
        </div>
      ))}
    </div>
  );
}