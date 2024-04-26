import { withCommonProps } from "next-common/lib";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isCentrifugeChain, isCollectivesChain } from "next-common/utils/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import AllianceOverviewSummary from "next-common/components/summary/allianceOverviewSummary";
import CentrifugeOverviewSummary from "next-common/components/summary/centrifugeOverviewSummary";
import { useUser } from "next-common/context/user";
import OffChainVoting from "next-common/components/summary/externalInfo/offChainVoting";
import Bounties from "next-common/components/summary/externalInfo/bounties";
import {
  hasDefinedBounties,
  hasDefinedOffChainVoting,
} from "next-common/utils/summaryExternalInfo";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import Escrow from "next-common/components/escrow/index";
import CentrifugeOverview from "next-common/components/overview/centrifugeOverview";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";
import { BasicDataProvider } from "next-common/context/centrifuge/basicData";
import { DailyExtrinsicsProvider } from "next-common/context/centrifuge/DailyExtrinsics";
import { TokenPricesProvider } from "next-common/context/centrifuge/tokenPrices";
import { useMemo } from "react";
import { redirect } from "next-common/utils/serverSideUtil";

export default function EscrowPage() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const user = useUser();
  const url = useAccountUrl();

  const isShowEscrow = useMemo(() => {
    return chain === "interlay" || chain === "kintsugi";
  }, [chain]);

  const tabs = [
    {
      label: "Overview",
      url: "/",
    },
  ];

  if (user?.address && chainSettings.showAccountManagementTab !== false) {
    tabs.push({
      label: "Account",
      url,
    });
  }

  if (isShowEscrow) {
    tabs.push({
      label: "Escrow",
      url: "/escrow",
      exactMatch: false,
    });
  }

  let externalInfo = null;
  if (hasDefinedOffChainVoting() || hasDefinedBounties()) {
    externalInfo = (
      <div className="grid grid-cols-2 gap-[16px] max-md:grid-cols-1">
        <OffChainVoting />
        <Bounties />
      </div>
    );
  }

  if (isCentrifugeChain(chain)) {
    return (
      <BasicDataProvider>
        <DailyExtrinsicsProvider>
          <TokenPricesProvider>
            <ListLayout
              title={chainSettings.name}
              titleExtra={<TitleExtra />}
              seoInfo={{ title: "" }}
              description={chainSettings.description}
              headContent={<HeadContent />}
              summary={<CentrifugeOverviewSummary />}
              summaryFooter={externalInfo}
              tabs={tabs}
            >
              <CentrifugeOverview />
            </ListLayout>
          </TokenPricesProvider>
        </DailyExtrinsicsProvider>
      </BasicDataProvider>
    );
  }

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={
        isCollectivesChain(chain) ? (
          <AllianceOverviewSummary />
        ) : (
          <OverviewSummary />
        )
      }
      summaryFooter={externalInfo}
      tabs={tabs}
    >
      <Escrow />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  if (
    process.env.CHAIN &&
    process.env.CHAIN !== "interlay" &&
    process.env.CHAIN !== "kintsugi"
  ) {
    return redirect("/");
  }
  return {
    props: {},
  };
});
