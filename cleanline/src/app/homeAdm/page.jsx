import DashboardHome from "@/components/dashboardHome";
import HeaderAdm from "@/components/headerAdm";
import Sidebar from "@/components/Sidebar";
export default function HomeAdm() {
    return (
        <div className="bg-[#f1f1f1]">
            <HeaderAdm />
            <Sidebar/>
            {/* <h1>Olá, {user.name} | Visão Geral do 5S</h1> */}
            <DashboardHome/>
        </div>
    )
}