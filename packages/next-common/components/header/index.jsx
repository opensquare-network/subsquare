import { useChainSettings } from "next-common/context/chain";
import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import SearchInput from "./searchInput";
import HeaderLayout from "./layout";

export default function Header() {
  const chainSettings = useChainSettings();

  return (
    <HeaderLayout
      search={<SearchInput />}
      account={
        <>
          <HeaderAccount />
          <NetworkSwitch activeNode={chainSettings} />
          <NodeSwitch small />
        </>
      }
    />
  );
}
