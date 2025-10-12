import { Skeleton } from "@/components/ui/fragments/shadcn-ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className=" group rounded-lg overflow-hidden  relative px-0  min-h-[18em] md:min-h-[23em]  bg-accent-foreground" />
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-xs w-full  bg-accent-foreground" />
        <Skeleton className="h-4 max-w-xs w-full  bg-accent-foreground" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-xs w-full  bg-accent-foreground" />
        <Skeleton className="h-4 max-w-xs w-full  bg-accent-foreground" />
      </div>
    </div>
  )
}
