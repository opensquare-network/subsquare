import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import SearchInput from "./searchInput";
import SearchInputWithPopup from "./searchInputWithPopup";
import useIsEnhancementSearch from "next-common/components/header/hooks/useIsEnhancementSearch";
import useActiveNodeChainSettings from "next-common/hooks/useActiveNodeChainSettings";

export default function Header() {
  const isEnhancementSearch = useIsEnhancementSearch();
  const activeNode = useActiveNodeChainSettings();

  return (
    <header className="py-4 px-6 flex gap-x-6 border-b border-neutral300 bg-neutral100">
      <div className="flex-1">
        {isEnhancementSearch ? <SearchInputWithPopup /> : <SearchInput />}
      </div>

      <div className="flex gap-x-2 relative">
        <HeaderAccount />
        <NetworkSwitch activeNode={activeNode} />
        <NodeSwitch small />
      </div>
    </header>
  );
}
