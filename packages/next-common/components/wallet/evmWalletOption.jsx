import { useDispatch } from "react-redux";
import WalletOption from "./walletOption";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import { ArrowRight, NetworkEthereumLight } from "@osn/icons/subsquare";

export default function EVMWalletOption() {
  const dispatch = useDispatch();

  return (
    <WalletOption
      installed
      onClick={() => {
        dispatch(setConnectPopupView("web3evm"));
      }}
    >
      <div className="flex items-center gap-2">
        <NetworkEthereumLight />
        EVM
      </div>
      <ArrowRight className="!w-5 !h-5 text-textSecondary" />
    </WalletOption>
  );
}
