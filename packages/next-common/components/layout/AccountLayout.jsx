import { useChain, useChainSettings } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import ListLayout from "./ListLayout";
import { useRouter } from "next/router";
import { isCollectivesChain } from "next-common/utils/chain";
import AllianceOverviewSummary from "../summary/allianceOverviewSummary";
import OverviewSummary from "../summary/overviewSummary";
import ChainSocialLinks from "../chain/socialLinks";
import {
  hasDefinedBounties,
  hasDefinedOffChainVoting,
} from "next-common/utils/summaryExternalInfo";
import OffChainVoting from "../summary/externalInfo/offChainVoting";
import Bounties from "../summary/externalInfo/bounties";
import { useEffect } from "react";

export default function AccountLayout(props) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.address) {
      router.push("/");
    }
  }, [user, router]);

  const SummaryComponent = isCollectivesChain(chain)
    ? AllianceOverviewSummary
    : OverviewSummary;

  const tabs = [
    {
      label: "Overview",
      url: "/",
    },
    user?.address && {
      label: "Account",
      url: "/account/votes",
    },
  ].filter(Boolean);

  let externalInfo = null;
  if (hasDefinedOffChainVoting() || hasDefinedBounties()) {
    externalInfo = (
      <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
        <OffChainVoting />
        <Bounties />
      </div>
    );
  }

  return (
    <ListLayout
      title={chainSettings.name}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<ChainSocialLinks />}
      summary={<SummaryComponent />}
      summaryFooter={externalInfo}
      tabs={tabs}
      {...props}
    />
  );
}
