import BaseLayout from "next-common/components/layout/baseLayout";
import { useChainSettings } from "next-common/context/chain";
import usePageTitle from "next-common/hooks/usePageTitle";
import NoWalletConnectedComponent from "next-common/components/noWalletConnected";

export default function NoWalletConnected() {
  const chainSettings = useChainSettings();
  const seoTitle = usePageTitle();
  const seoInfo = {
    title: "Subsquare | " + seoTitle,
    desc: chainSettings.description,
  };

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="h-full flex items-center justify-center">
        <NoWalletConnectedComponent text="Connect wallet to manage your on-chain assets." />
      </div>
    </BaseLayout>
  );
}
