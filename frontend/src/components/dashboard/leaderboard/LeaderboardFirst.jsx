export default function LeaderboardFirst({ setor, nota }) {
  return (
    <div className="space-y-2">
      <div className="relative z-30 overflow-hidden rounded-2xl border border-[#d4a017]/50 p-4 text-sm shadow-[0_10px_24px_rgba(212,160,23,0.18)]">
        <div className="absolute inset-0 bg-[var(--leaderboard-primeiro-bg)] opacity-55" />
        <div className="relative flex items-center justify-baseline gap-6">
          <span>
            <img src="icons/icon_trofeu-ouro.svg" alt="Ouro" className="h-20 w-20" />
          </span>
          <div className="flex flex-col gap-5">
            <span className="text-xl text-foreground">{setor} - Trofeu Ouro</span>
            <span className="text-xl text-foreground">Nota {nota}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
