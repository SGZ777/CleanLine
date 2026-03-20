import Header from "@/components/Header";
import Image from "next/image";


export default function Home() {
  return (
    <>
      <body>
        <Header></Header>
        <h1 className="mt-10 ms-5 text-8xl p-[3vw]">Auditoria <span className="text-[#24bff6]">5S</span> com<br/> confirmação física</h1>
        <p className="text-3xl ms-5 ps-[3vw]">O CleanLine garante que as auditorias 5S sejam<br/> realizadas no local correto, com comprovação real<br/> das condições do ambiente.</p>
        <button>Fazer Login</button>
      </body>
    </>
  );
}
