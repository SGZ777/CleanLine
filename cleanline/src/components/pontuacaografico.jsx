"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { date: "2026-06-01", desktop: 178, mobile: 200 },
  { date: "2026-06-02", desktop: 470, mobile: 410 },
  { date: "2026-06-03", desktop: 103, mobile: 160 },
  { date: "2026-06-04", desktop: 439, mobile: 380 },
  { date: "2026-06-05", desktop: 88, mobile: 140 },
  { date: "2026-06-06", desktop: 294, mobile: 250 },
  { date: "2026-06-07", desktop: 323, mobile: 370 },
  { date: "2026-06-08", desktop: 385, mobile: 320 },
  { date: "2026-06-09", desktop: 438, mobile: 480 },
  { date: "2026-06-10", desktop: 155, mobile: 200 },
  { date: "2026-06-11", desktop: 92, mobile: 150 },
  { date: "2026-06-12", desktop: 492, mobile: 420 },
  { date: "2026-06-13", desktop: 81, mobile: 130 },
  { date: "2026-06-14", desktop: 426, mobile: 380 },
  { date: "2026-06-15", desktop: 307, mobile: 350 },
  { date: "2026-06-16", desktop: 371, mobile: 310 },
  { date: "2026-06-17", desktop: 475, mobile: 520 },
  { date: "2026-06-18", desktop: 107, mobile: 170 },
  { date: "2026-06-19", desktop: 341, mobile: 290 },
  { date: "2026-06-20", desktop: 408, mobile: 450 },
  { date: "2026-06-21", desktop: 169, mobile: 210 },
  { date: "2026-06-22", desktop: 317, mobile: 270 },
  { date: "2026-06-23", desktop: 480, mobile: 530 },
  { date: "2026-06-24", desktop: 132, mobile: 180 },
  { date: "2026-06-25", desktop: 141, mobile: 190 },
  { date: "2026-06-26", desktop: 434, mobile: 380 },
  { date: "2026-06-27", desktop: 448, mobile: 490 },
  { date: "2026-06-28", desktop: 149, mobile: 200 },
  { date: "2026-06-29", desktop: 103, mobile: 160 },
  { date: "2026-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  views: {
    label: "",
  },
  desktop: {
    label: "",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "",
    color: "hsl(var(--chart-2))",
  },
};

export function PontuacaoGrafico() {
  const [activeChart, setActiveChart] = React.useState("desktop");
  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Média de pontuação de 5S mensal</CardTitle>
        
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}