export default function MaiorNotaDiaria() {
    return(
          <section className="w-80 h-35 md:w-105 md:h-45 rounded-[25px] bg-white m-6 shadow-md">
            <p className="text-center pt-2 text-2xl lg:text-4xl mt-4">Maior nota do dia</p>
            <div className="justify-self-center flex gap-4 mt-4"><p className="text-6xl lg:text-7xl">9.2/10</p>
                <img src="./icons/icon_yellow_star.png" className="w-14 h-14 lg:w-16 lg:h-16" />
            </div>
        </section>
    )
}