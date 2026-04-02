import Header from "@/components/Header";

export default function Home() {
  return (
      <section className="h-auto">
        <Header></Header>
        <section className="absolute z-2">
          <h1 className="ms-20 text-5xl mt-20 sm:text-5xl md:text-7xl lg:text-8xl ps-[3vw]">
            Auditoria <span className="text-[#24bff6]">5S</span> com
            <br /> confirmação física
          </h1>
          <p className="text-3xl ms-20 mt-5 ps-[3vw]">
            O CleanLine garante que as auditorias 5S sejam
            <br /> realizadas no local correto, com comprovação real
            <br /> das condições do ambiente.
          </p>
          <a href="login">
            <button className="cursor-pointer w-65 bg-[#24bff6] font-inter shadow-md mt-10 ms-35 text-3xl font-semibold text-white p-4 rounded-[10px] hover:bg-[#a3e7ff]">
              Fazer Login
            </button>
          </a>
        </section>
        <img src="home-background-image.png" className="w-full absolute mt-25 z-1"/>
        <img src="home-background-smartphone-image.png" className="absolute right-50 bottom-0 w-140 z-2"/>
      </section>
  );
}
