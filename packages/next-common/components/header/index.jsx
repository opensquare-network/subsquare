import { useChain, useChainSettings } from "next-common/context/chain";
import HeaderAccount from "./headerAccount";
import NetworkSwitch from "./networkSwitch";
import NodeSwitch from "./nodeSwitch";
import SearchInput from "./searchInput";
import HeaderLayout from "./layout";

export default function Header() {
  const chainSettings = useChainSettings();
  const chain = useChain();

  return (
    <HeaderLayout
      search={
        <SearchInput
          placeholder="Search on SubSquare"
          scope={`site:https://${chain}.subsquare.io`}
        />
      }
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
