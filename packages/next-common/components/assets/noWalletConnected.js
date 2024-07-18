import { SystemWalletDisconnected } from "@osn/icons/subsquare";
import BaseLayout from "next-common/components/layout/baseLayout";
import { useChainSettings } from "next-common/context/chain";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import usePageTitle from "next-common/hooks/usePageTitle";
import PrimaryButton from "next-common/lib/button/primary";

export default function NoWalletConnected() {
  const { openLoginPopup } = useLoginPopup();
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle();
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };

  return (
    <BaseLayout seoInfo={seoInfo}>
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
    </BaseLayout>
  );
}
