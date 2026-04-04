export default function PontuacaoMedia(){
    return(
        <section className="w-80 h-35 md:w-105 md:h-45 rounded-[25px] bg-white m-6 shadow-md">
            <p className="text-center pt-2 text-2xl lg:text-3xl mt-4">Pontuação média mensal</p>
            <div className="justify-self-center flex gap-4 mt-4"><p className="text-6xl lg:text-7xl">8.8/10</p>
                <img src="./icons/icon_green_arrow.png" className="w-9 h-14 lg:w-12 lg:h-18" /> 
            </div>
        </section>
    )
}