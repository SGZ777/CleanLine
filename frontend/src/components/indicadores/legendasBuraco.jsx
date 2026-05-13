"use client"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// Configuração de nomes e cores das legendas
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function ApenasLegenda() {
  return (
    <ChartContainer config={chartConfig} className="h-auto w-full">
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  )
}