import { ArrowRight, MenuMore } from "@osn/icons/subsquare";
import { useIsMacOS } from "next-common/context/page";
import { useCmdkPaletteVisible } from "next-common/components/cmdk/cmdkPalette";
import { cn } from "next-common/utils";
import { NAV_MENU_TYPE } from "next-common/utils/constants";
import { votingSpace, votingHost } from "next-common/utils/opensquareVoting";

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
      votingSpace && {
        value: "offChainVoting",
        name: "Off-chain Voting",
        pathname: `${votingHost}/space/${votingSpace}`,
      },
      {
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
