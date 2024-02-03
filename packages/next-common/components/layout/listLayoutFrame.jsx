import { cn } from "next-common/utils";

export default function ListLayoutFrame({ header, tabs, children }) {
  return (
    <>
      <div className="bg-neutral100 border-b border-neutral300">
        <div className={cn("px-12 py-6 mx-auto max-w-[1200px]", "max-sm:px-6")}>
          {header}
        </div>

        {tabs && (
          <div className={cn("px-12 mx-auto max-w-[1200px]", "max-sm:px-6")}>
            {tabs}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className={cn("px-6 py-6 mx-auto max-w-[1200px]", "max-sm:px-0")}>
          {children}
        </div>
      </div>
    </>
  );
}
