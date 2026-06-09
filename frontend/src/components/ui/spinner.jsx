import { cn } from "@/lib/utils"

export function Spinner({ className }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white",
        className
      )}
    />
  )
}
