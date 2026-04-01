export const sidebarItems = [
  {
    label: "Funcionarios",
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
    label: "Rotas",
    href: "/rotas",
    icon: "./icons/icon_rotas.png",
    alt: "Rotas",
  },
  {
    label: "Gestao de Checklists",
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
    "text-xl",
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
