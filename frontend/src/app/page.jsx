import Header from "@/components/layout/Header";

export default function Home() {
  return (
      <section className="h-auto">
        <Header/>
        <section className="absolute z-2 ps-[3vw] md:ps-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl md:ms-20 mt-20 lg:text-7xl">
            Auditoria <span className="text-[#24bff6]">5S</span> com
            <br /> confirmação física
          </h1>
          <p className="text-base sm:text-lg md:text-2xl md:text-3xl md:ms-20 mt-5">
            O CleanLine garante que as auditorias 5S sejam
            <br /> realizadas no local correto, com comprovação real
            <br /> das condições do ambiente.
          </p>
          <a href="login">
            <button className="cursor-pointer w-full sm:w-auto bg-[#24bff6] font-inter shadow-md mt-10 md:ms-35 text-lg sm:text-xl md:text-2xl font-semibold text-white px-6 py-3 md:p-4 rounded-[10px] hover:bg-[#a3e7ff]">
              Fazer Login
            </button>
          </a>
        </section>
        <img src="home-background-image.png" className="w-full absolute mt-25 z-1"/>
        <img src="home-background-smartphone-image.png" className="hidden md:hidden lg:block absolute right-50 bottom-0 w-140 z-2"/>
      </section>
  );
}
