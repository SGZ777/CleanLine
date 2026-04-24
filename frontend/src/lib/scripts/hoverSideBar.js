export const sidebarItems = [
   {
    label: "Visão Geral",
    href: "/homeAdm",
    icon: "./icons/icon_home.png",
    alt: "Visão Geral",
  },
  {
    label: "Funcionários",
    href: "/funcionarios",
    icon: "./icons/icon_funcionarios.png",
    alt: "Funcionarios",
  },
  {
    label: "Setores",
    href: "/setores",
    icon: "./icons/icon_setores.png",
    alt: "Setores",
  },
  {
    label: "Equipes",
    href: "/equipes",
    icon: "./icons/icon_equipes.svg",
    alt: "Equipes",
  },
  {
    label: "Rotas",
    href: "/rotas",
    icon: "./icons/icon_rotas.png",
    alt: "Rotas",
  },
  {
    label: "Gestão de Checklists",
    href: "/checklists",
    icon: "./icons/icon_checklists.png",
    alt: "Gestao de Checklists",
  },
  { 
    label: "Painel de indicadores",
    href: "/indicadores",
    icon: "./icons/icon_indicadores.png",
    alt: "Painel de indicadores",
  },
];

export function getSidebarItemClass(currentPath, itemPath) {
  const isActive = currentPath === itemPath;

  return [
    "text-white",
    "text-lg",
    "font-semibold",
    "flex",
    "items-center",
    "gap-4",
    "rounded-xl",
    "px-4",
    "py-3",
    "transition-colors",
    isActive ? "bg-[#24bff6]" : "hover:bg-[#24bff6]/40",
  ].join(" ");
}
