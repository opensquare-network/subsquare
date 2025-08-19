import { sortAddresses } from "@polkadot/util-crypto";
import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import DataList from "next-common/components/dataList";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import WindowSizeProvider from "next-common/context/windowSize";
import { AvatarWrapper } from "next-common/components/user/styled";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import Divider from "next-common/components/styled/layout/divider";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Tooltip from "next-common/components/tooltip";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import VoteByDelegate from "./voteByDelegate";
import { ParticipationValue } from "./common/cohortValueStyled";

const columns = [
  {
    name: "Account",
    style: { width: 240, textAlign: "left" },
  },
  {
    name: "Vote Counts",
    style: { textAlign: "left" },
  },
  {
    name: "Participation",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: (
      <span className="flex justify-end items-center gap-1">
        Win Rate
        <WinRateTooltip />
      </span>
    ),
    style: { width: 120, textAlign: "right" },
  },
];

function WinRateTooltip() {
  return (
    <Tooltip content="Probability that DV's votes align with the outcomes of referenda" />
  );
}

function DesktopList({ delegates }) {
  const { votes = [], referenda = [] } = usePageProps();
  const rows = delegates.map((delegate) => {
    const userVote = votes.filter((vote) => vote.account === delegate);

    const participation = userVote.length / referenda.length;

    return [
      <AddressUser key="account" add={delegate} />,
      <VoteByDelegate
        key="voteCounts"
        height={4}
        delegate={delegate}
        userVote={userVote}
      />,
      <ParticipationValue key="participation" value={participation} />,
      <ValueDisplay key="winRate" value={50} />,
    ];
  });
  return (
    <NeutralPanel className="p-6">
      <DataList
        columns={columns}
        rows={rows}
        loading={false}
        noDataText="No delegates"
        bordered={false}
      />
    </NeutralPanel>
  );
}

function MobileList() {
  return (
    <NeutralPanel className="p-6">
      <div className="flex flex-col gap-2">
        <AvatarWrapper>
          <AvatarDisplay size={40} address="" />
        </AvatarWrapper>
        <AddressUser
          key="account"
          add=""
          className="mt-2 text14Bold"
          showAvatar={false}
        />
      </div>
      <Divider className="my-3" />
      <VoteByDelegate key="voteCounts" className="gap-0" height={4} />
      <SummaryLayout className="mt-3">
        <SummaryItem title="Participation">
          <span className="text14Medium">82.14%</span>
        </SummaryItem>
        <SummaryItem title="Win Rate">
          <span className="text14Medium">82.14%</span>
        </SummaryItem>
      </SummaryLayout>
      <Divider className="my-3" />
    </NeutralPanel>
  );
}

function DelegatesImpl() {
  const isMobile = useIsMobile();
  const { cohort } = usePageProps();
  const { ss58Format } = useChainSettings();

  if (isNil(cohort)) return null;

  const delegates = sortAddresses(
    cohort.delegates?.map((delegate) => delegate.address) || [],
    ss58Format,
  );

  if (isMobile) {
    return <MobileList delegates={delegates} />;
  }

  return <DesktopList delegates={delegates} />;
}

export default function Delegates() {
  return (
    <WindowSizeProvider>
      <DelegatesImpl />
    </WindowSizeProvider>
  );
}
