import { ArrowRight, MenuMore } from "@osn/icons/subsquare";
import { useIsMacOS } from "next-common/context/page";
import { store } from "next-common/store";
import { setCmdkPaletteVisible } from "next-common/store/reducers/cmdkSlice";
import { cn } from "next-common/utils";
import isAssetHub from "next-common/utils/isAssetHub";
import { isPaseoChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

const space = process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;

export function getMoreMenu({ archivedMenu = [] }) {
  const chain = useChain();

  return {
    name: "More",
    icon: <MenuMore />,
    items: [
      {
        value: "calendar",
        name: "Calendar",
        pathname: "/calendar",
      },
      !isPaseoChain(chain) &&
        space && {
          value: "offChainVoting",
          name: "Off-chain Voting",
          pathname: `https://voting.opensquare.io/space/${space}`,
        },
      !isAssetHub() && {
        value: "navigation",
        name: "Navigation",
        onClick() {
          store.dispatch(setCmdkPaletteVisible(true));
        },
        extra: <NavigationExtra />,
      },
      archivedMenu?.length && {
        value: "archived",
        name: "Archived",
        type: "subspace",
        extra: <ArrowRight className="text-navigationTextTertiary" />,
        items: archivedMenu,
      },
    ].filter(Boolean),
  };
}

function NavigationExtra() {
  const isMacOS = useIsMacOS();

  return (
    <span
      className={cn(
        "bg-navigationActive rounded py-0.5 px-2",
        "text12Medium text-navigationTextTertiary",
      )}
    >
      {isMacOS ? "⌘" : "Ctrl +"} K
    </span>
  );
}
