import LoginEVMForm from "./form";
import { ArrowCircleLeft } from "@osn/icons/subsquare";
import WalletOption from "next-common/components/wallet/walletOption";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import { CONNECT_POPUP_VIEWS } from "next-common/utils/constants";
import isMixedChain from "next-common/utils/isMixedChain";
import { useDispatch } from "react-redux";

export default function LoginEVMContent() {
  const dispatch = useDispatch();
  const showBack = isMixedChain();

  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">EVM Address</span>
      </h3>

      {showBack && (
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          <WalletOption
            installed
            role="button"
            onClick={() => {
              dispatch(setConnectPopupView(CONNECT_POPUP_VIEWS.WEB3));
            }}
          >
            <div className="flex items-center">
              <ArrowCircleLeft className="text-textSecondary" />
              Back to Substrate
            </div>
          </WalletOption>
        </div>
      )}

      <LoginEVMForm />
    </div>
  );
}
