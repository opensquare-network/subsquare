import WalletOption from "./walletOption";
import { ArrowRight, NetworkEthereumLight } from "@osn/icons/subsquare";
import { noop } from "lodash-es";

export default function EVMEntryWalletOption({ onClick = noop }) {
  return (
    <WalletOption
      installed
      onClick={onClick}
      logo={<NetworkEthereumLight />}
      title="EVM"
      iconRight={<ArrowRight className="w-5 h-5 text-textTertiary" />}
    />
  );
}
