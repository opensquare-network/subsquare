import { cn } from "next-common/utils";

export default function MineTagOnCardView() {
  return (
    <div className="absolute left-0 top-[24px]">
      <MineTag />
    </div>
  );
}

export function MineTagOnListView() {
  return (
    <div className="absolute -left-[24px]">
      <MineTag />
    </div>
  );
}

export function MineTag() {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "bg-theme500 text-white",
        "h-[40px] w-[16px]",
        "rounded-tr-[4px] rounded-br-[4px]",
      )}
    >
      <span className="transform rotate-90 text12Bold">Mine</span>
    </div>
  );
}
