import BackToSubstrateWalletOption from "next-common/components/wallet/backToSubstrateWalletOption";
import LoginEVMForm from "./form";
import isMixedChain from "next-common/utils/isMixedChain";

export default function LoginEVMContent() {
  const showBack = isMixedChain();

  return (
    <div className="space-y-6">
      <h3 className="text20Bold text-textPrimary">
        <span>{"Connect with "}</span>
        <span className="text-theme500">EVM Address</span>
      </h3>

      {showBack && (
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          <BackToSubstrateWalletOption />
        </div>
      )}

      <LoginEVMForm />
    </div>
  );
}
