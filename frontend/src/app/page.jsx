import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Header />
        <section className="absolute z-20 top-0 left-0 w-full pb-32 flex flex-col justify-center h-full">
          <h1 className="md:ms-20 text-5xl lg:text-7xl ps-[3vw]">
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
        <img src="home-background-image.png" className="w-full absolute mt-25 z-10" />
        <img src="home-background-smartphone-image.png" className="hidden md:hidden lg:block absolute right-50 bottom-0 w-140 z-20" />

        <div className="absolute bottom-0 left-0 w-full h-48 z-30 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--degrade-principal) 0%, transparent 60%)' }}
        />
      </section>


      <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center">
        <div className="relative flex w-full md:w-7xl justify-self-center flex-col rounded-2xl shadow-md mt-15 p-10 bg-popover text-center items-center overflow-hidden">

          {/* Ondas decorativas */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 860 400"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
  d="M -20 185 Q 80 140, 200 190 Q 320 240, 440 175 Q 560 110, 680 180 Q 790 240, 900 190"
  fill="none" stroke="#24bff6" strokeWidth="26" opacity="0.15" strokeLinecap="round"
/>
<path
  d="M -20 235 Q 80 190, 200 240 Q 320 290, 440 225 Q 560 160, 680 230 Q 790 290, 900 240"
  fill="none" stroke="#24bff6" strokeWidth="20" opacity="0.15" strokeLinecap="round"
/>
<path
  d="M -20 285 Q 80 240, 200 290 Q 320 340, 440 275 Q 560 210, 680 280 Q 790 340, 900 290"
  fill="none" stroke="#24bff6" strokeWidth="20" opacity="0.15" strokeLinecap="round"
/>
          </svg>

          <div className="relative z-10 max-w-5xl text-center">
            <h2 className="text-4xl font-semibold mb-8">
              Sobre a <span className="text-[#24bff6]">Clean</span>Line
            </h2>
            <div className="text-xl leading-relaxed space-y-4">
              <p>
                O 5S-Track é um sistema moderno criado para transformar a forma com o as auditorias 5S são
                realizadas dentro das empresas. Com ele, a verificação de limpeza, organização e segurança deixa
                de ser feita em papel e passa a ser digital, prática e confiável.
              </p>
              <p>
                Através do aplicativo, os colaboradores realizam checklists diretamente no local da inspeção,
                garantindo que cada etapa do processo seja realmente verificada. O sistema também permite
                registrar fotos do ambiente e acompanhar os resultados em um painel simples e intuitivo.
              </p>
              <p>
                Com o 5S-Track, gestores conseguem acompanhar o desempenho dos setores, incentivar boas
                práticas e manter o ambiente de trabalho sempre organizado, seguro e produtivo.
              </p>
            </div>
          </div>

        </div>
      </section>



      <section className="relative w-full py-0 px-6 overflow-hidden flex flex-col items-center md:h-190">
        <img src="home-background-image.png" className="w-full mt-12 absolute z-10" />

        <h2 className="text-4xl font-semibold mb-12 mt-20 z-10">
          Porque somos a melhor opção?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full z-10 ">
          <div className="bg-primary-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl ">
            <img src="icon_checklist_principal.webp" alt="Checklists" className="w-24 h-24 object-contain mb-4" />
            <h3 className="text-xl font-bold  mb-2">Checklists</h3>
            <p className=" text-lg leading-relaxed">
              Auditorias preenchidas na hora, após a confirmação física.
            </p>
          </div>

          <div className="bg-primary-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl">
            <img src="icon_ftsdolocal_principal.png" alt="Fotos do local" className="w-24 h-24 object-contain mb-4" />
            <h3 className="text-xl font-bold  mb-2">Fotos do local</h3>
            <p className=" text-lg leading-relaxed">
              Registro fotográfico obrigando a comprovação visual.
            </p>
          </div>

          <div className="bg-primary-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl">
            <img src="icon_ranking_principal.png" alt="Ranking gamificado" className="w-24 h-24 object-contain mb-4" />
            <h3 className="text-xl font-bold  mb-2">Ranking gamificado</h3>
            <p className=" text-lg leading-relaxed">
              Competição saudável entre equipes e setores.
            </p>
          </div>

          <div className="bg-primary-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl">
            <img src="icon_painel_principal.webp" alt="Painel online" className="w-24 h-24 object-contain mb-4" />
            <h3 className="text-xl font-bold  mb-2">Painel online</h3>
            <p className=" text-lg leading-relaxed">
              Dashboard atualizado com auditorias em tempo real.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}