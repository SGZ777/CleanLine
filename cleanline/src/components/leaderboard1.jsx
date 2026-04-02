import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const defaultItems = [
  { name: "Usinagem - Troféu Ouro", value: "Nota 9.8" },
  { name: "Logística - Troféu Prata", value: "Nota 9.5" },
  { name: "Manutenção - Troféu Bronze", value: "Nota 9.2" },
];

const Leaderboard1 = ({
  title = "Ranking do mês",
  description = "O setor de Usinagem ganhou o troféu de ouro de organização este mês ",
  items = defaultItems,
  valuePrefix = "",
  trofeuOuro = {
    src: "icons/icon_trofeu-ouro.svg"
  },
  className
}) => {
  const maxValue = items[0]?.value || 1;

  return (
    <Card className={cn("w-full max-w-lg pb-6 bg-white ring-0 ", className)} >
      <CardHeader>
        <CardTitle className={" text-4xl "} >{title}</CardTitle>
        <CardDescription className={" text-lg "}>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
            <div key={index} className="space-y-2 ">
              <div className="flex items-center justify-baseline gap-6 text-sm bg-yellow-100 p-4 rounded-2xl ">
                <span><img src={trofeuOuro.src} className=" w-20 h-20 " /></span>
                <div className=" flex flex-col gap-5 ">
                <span className=" text-2xl ">{item.name}</span>
                <span className="text-muted-foreground text-xl ">
                  {valuePrefix}
                  {item.value.toLocaleString()}
                </span>
                </div>
              </div>
            </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { Leaderboard1 };
