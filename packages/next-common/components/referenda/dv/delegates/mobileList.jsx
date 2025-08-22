import {
  useFilteredDvReferenda,
  useFilteredDvVotes,
  useReferendaDvCount,
} from "next-common/context/referenda/dv";
import isWin from "next-common/utils/dv/isWin";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import VoteByDelegate from "../voteByDelegate";
import { ParticipationValue } from "../common/cohortValueStyled";
import WinRate from "../common/winRate";
import { AvatarWrapper } from "next-common/components/user/styled";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { AddressUser } from "next-common/components/user";
import { Divider } from "../../trackPanel/lineItem";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function DelegatesMobileList({ delegates }) {
  const votes = useFilteredDvVotes();
  const referenda = useFilteredDvReferenda();
  const count = useReferendaDvCount();

  return (
    <NeutralPanel className="p-6">
      {delegates.map((delegate) => {
        const userVote = votes.filter((vote) => vote.account === delegate);
        const voteCount = userVote.length;
        const winCount = userVote.filter((vote) =>
          isWin(vote, referenda),
        ).length;

        return (
          <div key={delegate}>
            <div className="flex flex-col gap-2">
              <AvatarWrapper>
                <AvatarDisplay size={40} address={delegate} />
              </AvatarWrapper>
              <AddressUser
                key="account"
                add={delegate}
                className="text14Bold"
                showAvatar={false}
              />
            </div>
            <Divider className="my-3" />
            <VoteByDelegate
              key="voteCounts"
              className="gap-0"
              height={4}
              delegate={delegate}
              userVote={userVote}
            />
            <SummaryLayout className="mt-3">
              <SummaryItem title="Participation">
                <ParticipationValue voteCount={voteCount} totalCount={count} />
              </SummaryItem>
              <SummaryItem title="Win Rate">
                <WinRate winCount={winCount} voteCount={voteCount} />
              </SummaryItem>
            </SummaryLayout>
            <Divider className="my-3" />
          </div>
        );
      })}
    </NeutralPanel>
  );
}
