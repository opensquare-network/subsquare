import { useChainSettings } from "next-common/context/chain";
import HeaderAccount from "../headerAccount";
import NetworkSwitch from "../networkSwitch";
import NodeSwitch from "../nodeSwitch";
import SearchInput from "../searchInput";

export default function Header() {
  const chainSettings = useChainSettings();

  return (
    <header className="h-[72px] py-4 px-6 flex gap-x-6 border-b border-neutral300 bg-neutral100">
      <div className="flex-1">
        <SearchInput />
      </div>

      <div className="flex gap-x-2">
        <HeaderAccount />
        <NetworkSwitch activeNode={chainSettings} />
        <NodeSwitch small />
      </div>
    </header>
  );
}
