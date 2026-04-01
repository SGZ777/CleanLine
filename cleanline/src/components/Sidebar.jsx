export default function Sidebar() {
    return (
        <div className="w-sm h-[850px] bg-[#1c96c2] rounded-r-[20px] pt-5 flex">
            <ul className="flex w-auto flex-col gap-8 p-4">
                <li className="text-white text-xl font-semibold flex"><img src="./icons/icon_funcionarios.png" className="w-7 me-7" alt="Funcionários"/>Funcionários</li>
                <li className="text-white text-xl font-semibold flex"><img src="./icons/icon_setores.png" className="w-7 me-7" alt="Setores"/>Setores</li>
                <li className="text-white text-xl font-semibold flex"><img src="./icons/icon_rotas.png" className="w-7 me-7" alt="Rotas"/>Rotas</li>
                <li className="text-white text-xl font-semibold flex"><img src="./icons/icon_checklists.png" className="w-7 me-7" alt="Gestão de Checklists"/>Gestão de Checklists</li>
                <li className="text-white text-xl font-semibold flex"><img src="./icons/icon_indicadores.png" className="w-7 me-7" alt="Painel de indicadores"/>Painel de indicadores</li>
            </ul>
        </div>
    )
}