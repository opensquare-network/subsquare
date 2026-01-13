import {
  useFilteredDvReferenda,
  useDvReferendaCount,
} from "next-common/context/referenda/dv";
import isWin from "next-common/utils/dv/isWin";
import VoteByDelegate from "../voteByDelegate";
import { ParticipationValue } from "../common/cohortValueStyled";
import WinRate from "../common/winRate";
import { AvatarWrapper } from "next-common/components/user/styled";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { AddressUser } from "next-common/components/user";
import { Divider } from "../../trackPanel/lineItem";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Loading from "next-common/components/loading";

export default function DelegatesMobileList({ delegates }) {
  const { filteredReferenda, loading } = useFilteredDvReferenda();
  const count = useDvReferendaCount();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loading size={20} />
      </div>
    );
  }
  return delegates.map((delegate) => {
    const winCount = delegate.userVotes.filter((vote) =>
      isWin(vote, filteredReferenda),
    ).length;

    return (
      <div key={delegate.address}>
        <div className="flex flex-col gap-2">
          <AvatarWrapper>
            <AvatarDisplay size={40} address={delegate.address} />
          </AvatarWrapper>
          <AddressUser
            key="account"
            add={delegate.address}
            className="text14Bold"
            showAvatar={false}
            username={delegate.name}
          />
        </div>
        <Divider className="my-3" />
        <VoteByDelegate
          key="voteCounts"
          className="gap-0"
          height={4}
          delegate={delegate.address}
          userVotes={delegate.userVotes}
        />
        <SummaryLayout className="mt-3">
          <SummaryItem title="Participation">
            <ParticipationValue
              voteCount={delegate.voteCount}
              totalCount={count}
            />
          </SummaryItem>
          <SummaryItem title="Win Rate">
            <WinRate winCount={winCount} voteCount={delegate.voteCount} />
          </SummaryItem>
        </SummaryLayout>
        <Divider className="my-3" />
      </div>
    );
  });
}
