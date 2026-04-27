export default function LeaderboardThird({ setor, nota }) {
  return (
    <div className="space-y-2">
      <div className="relative z-10 overflow-hidden rounded-2xl border border-[#b96e44]/30 p-4 text-sm shadow-[0_8px_20px_rgba(161,99,58,0.14)]">
        <div className="absolute inset-0 bg-[#d38b61] opacity-75" />
        <div className="relative flex items-center justify-baseline gap-6">
          <span><img src="icons/icon_trofeu_bronze.png" alt="Bronze" className="h-20 w-20" /></span>
          <div className="flex flex-col gap-5">
            <span className="text-xl text-black">{setor} - Troféu Bronze</span>
            <span className="text-xl text-black">Nota {nota}</span>
          </div>
        </div>
      </div>
    </div>
  );
}