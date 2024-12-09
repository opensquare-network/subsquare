import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import OverviewSummary from "next-common/components/summary/overviewSummary";
import { useUser } from "next-common/context/user";
import { HeadContent, TitleExtra } from "next-common/components/overview";
import Escrow from "next-common/components/escrow/index";
import useAccountUrl from "next-common/hooks/account/useAccountUrl";

export default function EscrowPage() {
  const chainSettings = useChainSettings();
  const user = useUser();
  const url = useAccountUrl();

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      url: "/",
    },
    {
      value: "escrow",
      label: "Escrow",
      url: "/escrow",
      exactMatch: false,
    },
  ];

  if (user?.address && chainSettings.showAccountManagementTab !== false) {
    tabs.push({
      value: "account",
      label: "Account",
      url,
    });
  }

  return (
    <ListLayout
      title={chainSettings.name}
      titleExtra={<TitleExtra />}
      seoInfo={{ title: "" }}
      description={chainSettings.description}
      headContent={<HeadContent />}
      summary={<OverviewSummary />}
      tabs={tabs}
    >
      <Escrow />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps();
