import HeaderAdm from "@/components/headerAdm";
import Sidebar from "@/components/Sidebar";
export default function HomeAdm() {
    return (
        <div className="bg-[#f1f1f1]">
            <HeaderAdm />
            <Sidebar/>
            
            <h1 className="text-4xl flex font-inter">Olá,  | Visão Geral do <span className="text-[#24bff6]"> 5S </span></h1>
        </div>
    )
}