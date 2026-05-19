// Componente do 2o lugar do ranking com responsividade melhorada
export default function LeaderboardSecond({ setor, nota }) {
  return (
    <div className="space-y-2">
      <div className="relative z-10 overflow-hidden rounded-xl sm:rounded-2xl border border-[#808080]/50 p-2 sm:p-4 text-xs sm:text-sm shadow-[0_8px_20px_rgba(161,99,58,0.14)]">
        <div className="absolute inset-0 bg-[var(--leaderboard-segundo-bg)] opacity-35" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-baseline gap-3 sm:gap-6">
          <span>
            <img src="icons/icon_trofeu_prata.png" alt="Prata" className="h-12 w-12 sm:h-16 md:h-20 sm:w-16 md:w-20" />
          </span>
          <div className="flex flex-col gap-2 sm:gap-5">
            <span className="text-sm sm:text-base md:text-xl text-foreground">{setor} - Trofeu Prata</span>
            <span className="text-sm sm:text-base md:text-xl text-foreground">Nota {nota}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
