import Header from "@/components/layout/Header";

export default function Home() {
  return (
      <section className="relative min-h-screen overflow-hidden">
        <Header/>
        <section className="relative z-2 px-6 pt-12 md:absolute md:px-0">
          <h1 className="text-4xl mt-8 md:ms-20 md:text-5xl lg:text-7xl md:ps-[3vw]">
            Auditoria <span className="text-[#24bff6]">5S</span> com
            <br /> confirmação física
          </h1>
          <p className="text-xl md:text-3xl md:ms-20 mt-5 md:ps-[3vw]">
            O CleanLine garante que as auditorias 5S sejam
            <br /> realizadas no local correto, com comprovação real
            <br /> das condições do ambiente.
          </p>
          <a href="login">
            <button className="cursor-pointer w-full max-w-55 bg-[#24bff6] font-inter shadow-md mt-10 md:ms-35 text-xl md:text-2xl font-semibold text-white p-4 rounded-[10px] hover:bg-[#a3e7ff]">
              Fazer Login
            </button>
          </a>
        </section>
        <img src="home-background-image.png" className="mt-8 w-full md:absolute md:mt-25 md:z-1"/>
        <img src="home-background-smartphone-image.png" className="hidden lg:block absolute right-8 xl:right-50 bottom-0 w-105 xl:w-140 z-1"/>
      </section>
  );
}
