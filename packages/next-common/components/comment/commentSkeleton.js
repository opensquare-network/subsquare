import { Skeleton } from "../skeleton";
import Divider from "../styled/layout/divider";

export default function CommentItemSkeleton() {
  return (
    <>
      <article className="pt-4">
        <header className="flex gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <h1 className="flex justify-between flex-1">
            <Skeleton className="w-20 h-5 rounded-[4px]" />
            <Skeleton className="w-20 h-5 rounded-[4px]" />
          </h1>
        </header>
        <section className="pl-7 pt-4 space-y-2">
          <Skeleton className="w-full h-5 rounded-[4px]" />
          <Skeleton className="w-full h-5 rounded-[4px]" />
          <Skeleton className="w-20 h-5 rounded-[4px]" />
        </section>
        <footer className="pl-7 pt-4">
          <Divider height={2} className="h-[2px]" />
        </footer>
      </article>
    </>
  );
}
