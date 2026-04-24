"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    title: "Bem-vindo!",
    subtitle: "Aprenda agora a usar o app",
    description:
      "Comece a conhecer o funcionamento do sistema e aprenda a navegar pelo app com facilidade.",
    image: "/tutorial/intro.png",
    imageAlt: "Tela de introducao do tutorial do aplicativo",
    button: "Pr\u00f3ximo",
  },
  {
    title: "Como utilizar o CleanLine",
    subtitle: "Veja as principais fun\u00e7\u00f5es do sistema",
    description: "Acompanhe o fluxo do app de forma simples e visual.",
    items: [
      {
        title: "Passo 1",
        text: "Acesse a tela inicial e veja as op\u00e7\u00f5es dispon\u00edveis.",
        image: "/tutorial/step1.png",
        imageAlt: "Primeira tela do tutorial com as opcoes iniciais do sistema",
      },
      {
        title: "Passo 2",
        text: "Escolha a fun\u00e7\u00e3o desejada para continuar no sistema.",
        image: "/tutorial/step2.png",
        imageAlt: "Tela de selecao de funcao no aplicativo",
      },
      {
        title: "Passo 3",
        text: "Informe ou consulte os dados solicitados.",
        image: "/tutorial/step3.png",
        imageAlt: "Tela para consulta ou preenchimento de dados no aplicativo",
      },
      {
        title: "Passo 4",
        text: "Finalize a a\u00e7\u00e3o e acompanhe o resultado no app.",
        image: "/tutorial/step4.png",
        imageAlt: "Tela final com o resultado da acao realizada no aplicativo",
      },
    ],
    button: "Pr\u00f3ximo",
  },
  {
    title: "Pronto!",
    subtitle: "Tudo pronto para come\u00e7ar",
    description:
      "Agora voc\u00ea j\u00e1 pode acessar o sistema e utilizar todas as funcionalidades do aplicativo.",
    image: "/tutorial/final.png",
    imageAlt: "Tela final do tutorial indicando que o usuario pode comecar",
    button: "Come\u00e7ar",
  },
];

function SlideIllustration({ slide, isOverview }) {
  if (isOverview) {
    return (
      <ul className="grid w-full gap-4 sm:gap-5">
        {slide.items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-4 rounded-[24px] border border-[#eadfce] bg-[#fffaf4] p-4 shadow-md sm:flex-row sm:items-center sm:p-5"
          >
            <div className="relative h-44 overflow-hidden rounded-[20px] bg-white sm:h-32 sm:w-56 sm:shrink-0">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-[#18255f] sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6f98]">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="relative h-[280px] w-full max-w-[680px] sm:h-[380px] lg:h-[560px]">
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        fill
        priority
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 680px"
      />
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const slide = slides[current];
  const totalSlides = slides.length;
  const isOverview = current === 1;
  const isLastSlide = current === totalSlides - 1;
  const counterText = `${current + 1}/${totalSlides}`;

  const handleNext = () => {
    if (current < totalSlides - 1) {
      setCurrent((prev) => prev + 1);
      setHasFinished(false);
      return;
    }

    setHasFinished(true);
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setHasFinished(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef2ff] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="absolute -left-32 -top-32 h-[320px] w-[320px] rounded-full bg-blue-200/60 blur-[120px] sm:h-[500px] sm:w-[500px]" />
      <div className="absolute bottom-[-140px] right-[-120px] h-[280px] w-[280px] rounded-full bg-cyan-200/60 blur-[120px] sm:h-[400px] sm:w-[400px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1560px] flex-col gap-6">
        <div className="relative h-16 w-36 sm:h-20 sm:w-44">
          <Image
            src="/logo.png"
            alt="Logo do CleanLine"
            fill
            className="object-contain object-left"
            priority
            sizes="176px"
          />
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#ece2d4] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <div className="grid min-h-[720px] lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <div className="flex items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff_0%,#f7faff_70%)] px-4 py-8 sm:px-8 lg:px-10">
              <SlideIllustration slide={slide} isOverview={isOverview} />
            </div>

            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="rounded-full bg-[#f8f3eb] px-5 py-3 text-sm font-bold text-[#6b5b4d] sm:text-base">
                  {counterText}
                </div>

                <div className="flex items-center gap-3">
                  {current > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Voltar para o slide anterior"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f3eb] text-xl text-[#8b6b4f] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18255f]"
                    >
                      <span aria-hidden="true">&larr;</span>
                    </button>
                  )}

                  {!isLastSlide && (
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Avan\u00e7ar para o pr\u00f3ximo slide"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18255f] text-xl text-white transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18255f]"
                    >
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex gap-2" aria-hidden="true">
                  {slides.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2.5 rounded-full transition-all ${
                        index === current ? "w-8 bg-[#18255f]" : "w-2.5 bg-[#d8dceb]"
                      }`}
                    />
                  ))}
                </div>

                <h1 className="mt-6 max-w-[12ch] text-4xl font-extrabold tracking-tight text-[#18255f] sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>

                <h2 className="mt-4 text-lg font-semibold text-sky-600 sm:text-xl">
                  {slide.subtitle}
                </h2>

                <p className="mt-6 max-w-[56ch] text-base leading-7 text-[#66739b] sm:text-lg sm:leading-8">
                  {slide.description}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-2xl bg-[#18255f] px-6 py-4 text-base font-semibold text-white transition hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18255f] sm:w-fit sm:px-10 sm:py-5 sm:text-lg"
                >
                  {slide.button}
                </button>

                {hasFinished && (
                  <p className="text-sm leading-6 text-[#4a5a86]">
                    Tutorial conclu\u00eddo. Agora \u00e9 s\u00f3 integrar este bot\u00e3o ao fluxo principal do app.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
