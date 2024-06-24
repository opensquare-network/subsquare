import { useConnectPopupView } from "next-common/hooks/connect/useConnectPopupView";
import WalletOption from "./walletOption";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import { ArrowCircleLeft } from "@osn/icons/subsquare";

/**
 * @param {Parameters<WalletOption>[0]} props
 */
export default function BackToSubstrateWalletOption(props) {
  const [, setView] = useConnectPopupView();

  return (
    <WalletOption
      installed
      onClick={() => {
        setView(CONNECT_POPUP_VIEWS.WEB3);
      }}
      logo={<ArrowCircleLeft className="text-textSecondary" />}
      title="Back to Substrate"
      {...props}
    />
  );
}
