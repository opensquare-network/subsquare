import { cn } from "next-common/utils";

export default function MineTag() {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "bg-theme500 text-white",
        "absolute left-0 top-[24px] h-[40px] w-[16px]",
        "rounded-tr-[4px] rounded-br-[4px]",
      )}
    >
      <span className="transform rotate-90 text12Bold">Mine</span>
    </div>
  );
}
