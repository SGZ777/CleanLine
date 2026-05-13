import Header from "@/components/layout/Header";

export default function Home() {
  return (
      <section className="h-auto">
        <Header/>
        <section className="absolute z-2">
          <h1 className="md:ms-20 text-5xl mt-20 lg:text-7xl ps-[3vw]">
            Auditoria <span className="text-[#24bff6]">5S</span> com
            <br /> confirmação física
          </h1>
          <p className="text-3xl md:ms-20 mt-5 ps-[3vw]">
            O CleanLine garante que as auditorias 5S sejam
            <br /> realizadas no local correto, com comprovação real
            <br /> das condições do ambiente.
          </p>
          <a href="login">
            <button className="cursor-pointer w-55 bg-[#24bff6] font-inter shadow-md mt-10 ms-35 text-2xl font-semibold text-white p-4 rounded-[10px] hover:bg-[#a3e7ff]">
              Fazer Login
            </button>
          </a>
        </section>
        <img src="home-background-image.png" className="w-full absolute mt-25 z-1"/>
        <img src="home-background-smartphone-image.png" className="hidden md:hidden lg:block absolute right-50 bottom-0 w-140 z-2"/>
      </section>
  );
}
