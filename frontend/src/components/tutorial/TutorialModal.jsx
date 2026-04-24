"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    title: "Bem-vindo!",
    subtitle: "Aprenda agora a usar o app",
    description:
      "Comece a conhecer o funcionamento do sistema e aprenda a navegar pelo sistema com facilidade.",
    image: "/tutorial/intro.png",
    imageAlt: "Tela de introdução do tutorial do sistema",
    button: "Próximo",
  },
  {
    title: "Como utilizar o CleanLine",
    subtitle: "Veja as principais funções do sistema",
    description: "Acompanhe o fluxo do app de forma simples e visual.",
    items: [
      {
        title: "Passo 1",
        text: "Acesse a tela inicial e veja as opções disponíveis.",
        image: "/tutorial/step1.png",
        imageAlt: "Primeira tela do tutorial com as opções iniciais do sistema",
      },
      {
        title: "Passo 2",
        text: "Escolha a função desejada para continuar no sistema.",
        image: "/tutorial/step2.png",
        imageAlt: "Tela de seleção de função no sistema",
      },
      {
        title: "Passo 3",
        text: "Informe ou consulte os dados solicitados.",
        image: "/tutorial/step3.png",
        imageAlt: "Tela para consulta ou preenchimento de dados no sistema",
      },
      {
        title: "Passo 4",
        text: "Finalize a ação e acompanhe o resultado no app.",
        image: "/tutorial/step4.png",
        imageAlt: "Tela final com o resultado da ação realizada no sistema",
      },
    ],
    button: "Próximo",
  },
  {
    title: "Pronto!",
    subtitle: "Tudo pronto para começar",
    description:
      "Agora você já pode acessar o sistema e utilizar todas as funcionalidades do sistema.",
    image: "/tutorial/final.png",
    imageAlt: "Tela final do tutorial indicando que o usuário pode começar",
    button: "Começar",
  },
];

function SlideIllustration({ slide, isOverview }) {
  if (isOverview) {
    return (
      <ul className="grid w-full gap-3 md:gap-4">
        {slide.items.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-3 rounded-3xl border border-[#eadfce] bg-[#fffaf4] p-3 shadow-sm md:flex-row md:items-center md:p-4"
          >
            <div className="relative h-40 overflow-hidden rounded-[18px] bg-white md:h-28 md:w-48 md:shrink-0">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-extrabold text-[#18255f] md:text-lg">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#5f6f98]">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="relative h-60 w-full max-w-155 md:h-80 lg:h-105">
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        fill
        priority
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 620px"
      />
    </div>
  );
}

export default function TutorialModal({ userName, onClose }) {
  const [current, setCurrent] = useState(0);

  const totalSlides = SLIDES.length;
  const slide = SLIDES[current];
  const isOverview = current === 1;
  const isLastSlide = current === totalSlides - 1;

  const counterText = useMemo(
    () => `${current + 1}/${totalSlides}`,
    [current, totalSlides]
  );

  const handleNext = () => {
    if (isLastSlide) {
      onClose();
      return;
    }

    setCurrent((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (current === 0) return;
    setCurrent((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#ece2d4] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-200/60 blur-[100px]" />
        <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-cyan-200/60 blur-[100px]" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 bg-white/70 hover:bg-white"
          onClick={onClose}
          aria-label="Fechar tutorial"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="relative z-10 grid max-h-[90vh] overflow-y-auto lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="flex items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff_0%,#f7faff_70%)] px-4 py-8 md:px-8">
            <SlideIllustration slide={slide} isOverview={isOverview} />
          </div>

          <div className="flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <img
                  src="/logoCleanline.png"
                  alt="Cleanline"
                  className="h-8 w-auto object-contain"
                />
                <p className="mt-3 text-sm text-[#5f6f98]">
                  {userName ? `Olá, ${userName}.` : "Olá."} Este tutorial aparece apenas no seu primeiro acesso.
                </p>
              </div>

              <div className="rounded-full bg-[#f8f3eb] px-4 py-2 text-sm font-bold text-[#6b5b4d]">
                {counterText}
              </div>
            </div>

            <div>
              <div className="flex gap-2" aria-hidden="true">
                {SLIDES.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2.5 rounded-full transition-all ${
                      index === current ? "w-8 bg-[#18255f]" : "w-2.5 bg-[#d8dceb]"
                    }`}
                  />
                ))}
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#18255f] md:text-5xl">
                {slide.title}
              </h1>

              <h2 className="mt-3 text-lg font-semibold text-sky-600 md:text-xl">
                {slide.subtitle}
              </h2>

              <p className="mt-5 text-base leading-7 text-[#66739b] md:text-lg md:leading-8">
                {slide.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#24bff6]"
                  onClick={handlePrev}
                  disabled={current === 0}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border bg-transparent"
                  onClick={onClose}
                >
                  Pular
                </Button>
              </div>

              <Button
                type="button"
                className="bg-[#18255f] px-8 text-white hover:bg-[#0f1840]"
                onClick={handleNext}
              >
                {slide.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}