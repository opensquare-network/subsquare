import { ArrowCircleLeft } from "@osn/icons/subsquare";
import WalletOption from "./walletOption";

/**
 * @param {Parameters<WalletOption>[0]} props
 */
export default function BackToSubstrateWalletOption(props) {
  return (
    <WalletOption
      installed
      logo={<ArrowCircleLeft className="text-textSecondary" />}
      title="Back to Substrate"
      {...props}
    />
  );
}
