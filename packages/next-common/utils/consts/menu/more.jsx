import { ArrowRight, MenuMore } from "@osn/icons/subsquare";
import { useIsMacOS } from "next-common/context/page";
import { useCmdkPaletteVisible } from "next-common/components/cmdk/cmdkPalette";
import { cn } from "next-common/utils";
import isAssetHub from "next-common/utils/isAssetHub";
import { NAV_MENU_TYPE } from "next-common/utils/constants";

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;

export function getMoreMenu({ archivedMenu = [] }) {
  return {
    name: "More",
    icon: <MenuMore />,
    items: [
      {
        value: "calendar",
        name: "Calendar",
        pathname: "/calendar",
      },
      space && {
        value: "offChainVoting",
        name: "Off-chain Voting",
        pathname: `https://voting.opensquare.io/space/${space}`,
      },
      !isAssetHub() && {
        value: "navigation",
        name: <NavigationItem />,
      },
      archivedMenu?.length && {
        value: "archived",
        name: "Archived",
        type: NAV_MENU_TYPE.archived,
        extra: <ArrowRight className="text-navigationTextTertiary" />,
        items: archivedMenu,
      },
    ].filter(Boolean),
  };
}

function NavigationItem() {
  const [, setCmdkPaletteVisible] = useCmdkPaletteVisible();
  const isMacOS = useIsMacOS();

  return (
    <span
      className="w-full inline-flex justify-between"
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
