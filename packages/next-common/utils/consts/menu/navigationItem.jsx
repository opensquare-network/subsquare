import { useIsMacOS } from "next-common/context/page";
import { useCmdkPaletteVisible } from "next-common/components/cmdk/cmdkPalette";
import { cn } from "next-common/utils";

export default function NavigationItem() {
  const [, setCmdkPaletteVisible] = useCmdkPaletteVisible();
  const isMacOS = useIsMacOS();

  return (
    <span
      className="w-full gap-2 inline-flex items-center justify-between"
      onClick={() => {
        setCmdkPaletteVisible(true);
      }}
    >
      Navigation
      <span
        className={cn(
          "bg-navigationActive rounded py-0.5 px-2",
          "text12Medium text-navigationTextTertiary",
        )}
      >
        {isMacOS ? "⌘" : "Ctrl +"} K
      </span>
    </span>
  );
}
