export default function Sidebar() {
    return (
        <div className="w-[20%] h-[850px] bg-[#1c96c2] rounded-r-[20px]">
            <ul className="flex flex-col gap-4 p-4">
                <li className="text-white text-xl font-semibold flex"><img src="icon_funcionarios.png" className="w-6 me-7" alt="Funcionários"/>Funcionários</li>
                <li className="text-white text-xl font-semibold flex"><img src="icon_setores.png" className="w-6 me-7" alt="Setores"/>Setores</li>
                <li className="text-white text-xl font-semibold flex"><img src="icon_rotas.png" className="w-6 me-7" alt="Rotas"/>Rotas</li>
                <li className="text-white text-xl font-semibold flex"><img src="icon_checklists.png" className="w-6 me-7" alt="Gestão de Checklists"/>Gestão de Checklists</li>
                <li className="text-white text-xl font-semibold flex"><img src="icon_indicadores.png" className="w-6 me-7" alt="Painel de indicadores"/>Painel de indicadores</li>
            </ul>
        </div>
    )
}