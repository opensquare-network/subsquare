import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import { CreateReferendumAndVote } from "./fellowshipMember/wishDetail";
import { FellowshipReferendumTitleImpl } from "next-common/components/fellowshipReferendumTitle";
import { ReferendumVoteButtons } from "./fellowshipMember/voteButtons";
import MyVote from "./fellowshipMember/myVote";
import tw from "tailwind-styled-components";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useFetch from "next-common/hooks/useFetch";
import { gov2VotingStates } from "next-common/utils/consts/state";

const CreateReferendumAndVoteArea = tw(CreateReferendumAndVote)`
  !w-full
  [&_div]:max-sm:!w-full
  [&_div]:max-sm:!flex
  [&_button]:max-sm:!flex
  [&_button]:max-sm:!w-full
`;

const ReferendumVoteButtonsArea = tw(ReferendumVoteButtons)`
  max-sm:!w-full
  max-sm:!flex-1
  [&_div]:max-sm:!w-full
  [&_div]:max-sm:!flex
  [&_button]:max-sm:!flex
  [&_button]:max-sm:!w-full
`;

const ReferendumTitleWrapper = tw(FellowshipReferendumTitleImpl)`
  [&_a]:truncate
`;

export function EvidenceRelatedReferendaImpl() {
  const { detail } = usePageProps() || {};
  const { referenda = [] } = detail || {};

  if (referenda.length <= 0) {
    return (
      <SecondaryCard className="!p-4">
        <div className="flex gap-x-[16px] justify-between items-center max-sm:flex-col max-sm:gap-y-3">
          <p className="text-textTertiary text14Medium w-full max-sm:text-center">
            No referendum was created
          </p>
          <CreateReferendumAndVoteArea who={detail.who} wish={detail.wish} />
        </div>
      </SecondaryCard>
    );
  }
  return referenda.map((referendum, index) => (
    <SecondaryCard key={index} className="!p-4">
      <ReferendumVoteItem key={index} referendumIndex={referendum.index} />
    </SecondaryCard>
  ));
}

export default function EvidenceRelatedReferenda() {
  const { detail } = usePageProps() || {};

  if (!detail) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4 mt-6">
      <label className="text-textPrimary text14Bold">Related Referendum</label>
      <EvidenceRelatedReferendaImpl />
    </div>
  );
}

function ReferendumVoteItem({ referendumIndex }) {
  const { section } = useCollectivesContext();
  const { value: detail, loading } = useFetch(
    `/api/${section}/referenda/${referendumIndex}`,
  );

  const isVoting = gov2VotingStates.includes(detail?.state?.name);

  return (
    <div className="flex items-center justify-between w-full text14Medium gap-x-4 max-sm:flex-col max-sm:gap-y-3">
      <div className="flex flex-col gap-[4px] flex-1 min-w-0 w-full min-h-[40px] justify-center">
        <ReferendumTitleWrapper
          referendumIndex={referendumIndex}
          title={detail?.title}
          loading={loading}
        />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      {isVoting && (
        <ReferendumVoteButtonsArea referendumIndex={referendumIndex} />
      )}
    </div>
  );
}
