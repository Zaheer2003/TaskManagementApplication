import { Spinner } from "@/components/ui/spinner"

export function PageLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">Loading page...</p>
      </div>
    </div>
  )
}
