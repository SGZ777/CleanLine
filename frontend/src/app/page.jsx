import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      {/* Hero Section - Premium SaaS Design */}
      <section className="relative w-full min-h-screen pb-10 overflow-hidden bg-gradient-to-br from-[#f8fafb] via-[#f5f8fb] to-[#eff3f7]">
        {/* Decorative gradient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Soft blue glow on the right side */}
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute right-0 top-1/3 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
          
          {/* Subtle wave patterns */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="wave" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M0,60 Q30,30 60,60 T120,60" fill="none" stroke="#1c96c2" strokeWidth="1" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="1200" height="600" fill="url(#wave)" />
          </svg>
        </div>
        <Header />

        {/* Main Content Container */}
        <div className="relative z-10 w-full h-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-200px)]">
              
              {/* Left Column - Content */}
              <div className="flex flex-col h-auto justify-center space-y-8">
                {/* Headline */}
                <div className="w-200">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                    <span className="text-[#102238] dark:text-[#e7f0f7]">Garanta auditorias</span>
                    <br />
                    <span className="text-[#24bff6] dark:text-[#59d6ff]">5S</span>
                    <span className="text-[#102238] dark:text-[#e7f0f7]"> com validação</span>
                    <br />
                    <span className="text-[#102238] dark:text-[#e7f0f7]">evidenciada</span>
                    <span className="text-[#24bff6] dark:text-[#59d6ff]">.</span>
                  </h1>
                </div>

                {/* Subheadline */}
                <p className="text-lg lg:text-xl text-[#58708c] dark:text-[#93abc0] leading-relaxed max-w-xl font-light">
                  Confirme que cada auditoria foi realizada no local correto, com evidências reais do ambiente auditado.
                </p>

                {/* CTA Button */}
                <div className="pt-4">
                  <a href="/login" className="inline-block">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-[#1c96c2] to-[#24bff6] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 text-lg">
                      <span>Entrar na plataforma</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </a>
                </div>

                {/* Benefits Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                  {/* Benefit 1 */}
                  <div className="flex flex-col items-start space-y-3 p-4 rounded-lg bg-white/40 dark:bg-[#0c1d2c]/40 backdrop-blur-sm border border-white/60 dark:border-[#22384b]/60 hover:bg-white/60 dark:hover:bg-[#0c1d2c]/60 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#24bff6] to-[#1c96c2] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-[#102238] dark:text-[#e7f0f7]">Auditorias verificadas</h3>
                    <p className="text-sm text-[#58708c] dark:text-[#93abc0]">Validação real das condições do ambiente.</p>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex flex-col items-start space-y-3 p-4 rounded-lg bg-white/40 dark:bg-[#0c1d2c]/40 backdrop-blur-sm border border-white/60 dark:border-[#22384b]/60 hover:bg-white/60 dark:hover:bg-[#0c1d2c]/60 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#24bff6] to-[#1c96c2] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-[#102238] dark:text-[#e7f0f7]">Evidência fotográfica</h3>
                    <p className="text-sm text-[#58708c] dark:text-[#93abc0]">Registros visuais que comprovam cada etapa.</p>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex flex-col items-start space-y-3 p-4 rounded-lg bg-white/40 dark:bg-[#0c1d2c]/40 backdrop-blur-sm border border-white/60 dark:border-[#22384b]/60 hover:bg-white/60 dark:hover:bg-[#0c1d2c]/60 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#24bff6] to-[#1c96c2] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-[#102238] dark:text-[#e7f0f7]">Validação de localização</h3>
                    <p className="text-sm text-[#58708c] dark:text-[#93abc0]">Confirmação de que foi no local correto.</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Smartphone Mockup */}
              <div className="relative hidden lg:flex items-center justify-center">
                {/* Glow effect behind phone */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-80 h-96 bg-gradient-to-r from-[#24bff6]/30 to-[#1c96c2]/20 rounded-full filter blur-3xl opacity-60 animate-pulse" />
                </div>

                {/* Phone container with 3D perspective */}
                <div className="relative mb-50 z-10 w-80 h-auto perspective">
                  {/* Phone frame */}
                  <div className="relative w-full h-auto rounded-3xl bg-black shadow-2xl overflow-hidden border-8 border-gray-900 transform hover:scale-105 transition-transform duration-300"
                    style={{
                      boxShadow: '0 20px 60px rgba(36, 191, 246, 0.3), 0 0 80px rgba(36, 191, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)'
                    }}
                  >
                    {/* Phone screen content */}
                    <div className="w-full h-auto bg-gradient-to-b from-white to-gray-50 dark:from-[#0c1d2c] dark:to-[#07131d] overflow-hidden flex flex-col">
                      {/* Status bar */}
                      <div className="flex justify-between items-center px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 00-1.414-1.414 9 9 0 0112.728 0 1 1 0 00-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 00-1.415-1.415 5 5 0 017.072 0 1 1 0 00-1.415 1.415zM9.88 9.88a1 1 0 011.414 0 1 1 0 010 1.414 1 1 0 01-1.414-1.414z" clipRule="evenodd" /></svg>
                        </div>
                      </div>

                      {/* App header */}
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-[#22384b]">
                        <h2 className="text-lg font-bold text-[#24bff6]">CleanLine</h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Auditoria 5S</p>
                      </div>

                      {/* App content */}
                      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {/* Progress */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">5/8</span>
                        </div>

                        {/* Checklist items */}
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-[#163045] rounded-lg">
                              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <div className="flex-1 h-3 bg-gray-300 dark:bg-[#22384b] rounded-full" />
                            </div>
                          ))}
                        </div>

                        {/* Photo evidence */}
                        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-[#22384b]">
                          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120'%3E%3Crect fill='%23e5e7eb' width='200' height='120'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EFoto do Ambiente%3C/text%3E%3C/svg%3E" alt="Environment" className="w-full h-24 object-cover bg-gray-300 dark:bg-[#163045]" />
                        </div>

                        {/* Validation badge */}
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold text-green-700 dark:text-green-300">Área organizada</span>
                        </div>
                      </div>

                      {/* Bottom navigation */}
                      <div className="border-t border-gray-200 dark:border-[#22384b] px-4 py-3 flex justify-around items-center">
                        <button className="flex flex-col items-center gap-1 text-[#24bff6]">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                          <span className="text-xs">Início</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" /></svg>
                          <span className="text-xs">Auditorias</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                          <span className="text-xs">Relatórios</span>
                        </button>
                      </div>
                    </div>

                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafb] to-transparent pointer-events-none" />
     

      <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center">
        <div className="relative flex w-full md:w-7xl justify-self-center flex-col rounded-2xl shadow-md mt-15 p-10 bg-popover text-center items-center overflow-hidden">
          <img src=".png" className="hidden md:hidden lg:block absolute right-50 bottom-0 w-140 z-20" />


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
          Por que somos a melhor opção?
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
 </section>
    </>
  );
}
