import { SystemWalletDisconnected } from "@osn/icons/subsquare";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import PrimaryButton from "next-common/lib/button/primary";

export default function NoWalletConnected() {
  const { openLoginPopup } = useLoginPopup();

  return (
    <div className="flex flex-col justify-center py-[24px] gap-[24px] grow bg-neutral100">
      <div className="flex flex-col items-center gap-[8px]">
        <div className="[&_svg_path]:fill-textTertiary">
          <SystemWalletDisconnected width={40} height={40} />
        </div>
        <div className="text14Bold text-textPrimary">No Wallet Connected</div>
        <div className="text14Medium text-textTertiary">
          Connect wallet to manage your on-chain assets.
        </div>
      </div>
      <div className="flex justify-center">
        <PrimaryButton onClick={openLoginPopup}>Connect Wallet</PrimaryButton>
      </div>
    </div>
  );
}
