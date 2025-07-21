import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import { CreateReferendumAndVote } from "./fellowshipMember/wishDetail";
import { FellowshipReferendumTitleImpl } from "next-common/components/fellowshipReferendumTitle";
import { ReferendumVoteButtons } from "./fellowshipMember/voteButtons";
import MyVote from "./fellowshipMember/myVote";
import tw from "tailwind-styled-components";

const CreateReferendumAndVoteArea = tw(CreateReferendumAndVote)`
  max-sm:!w-full
  [&_div]:max-sm:!w-full
  [&_div]:max-sm:!flex
  [&_button]:max-sm:!flex
  [&_button]:max-sm:!w-full
`;

const ReferendumVoteButtonsArea = tw(ReferendumVoteButtons)`
  max-sm:!w-full
  [&_div]:max-sm:!w-full
  [&_div]:max-sm:!flex
  [&_button]:max-sm:!flex
  [&_button]:max-sm:!w-full
`;

export default function EvidenceRelatedReferenda() {
  const { detail } = usePageProps() || {};

  const { referenda = [] } = detail || {};

  if (!referenda.length) {
    return null;
  }

  if (referenda.length <= 0) {
    return (
      <SecondaryCard className="mt-4 !p-4">
        <div className="flex gap-x-[16px] justify-between items-center max-sm:flex-col max-sm:gap-y-3">
          <p className="text-textTertiary text14Medium">
            No referendum was created
          </p>
          <CreateReferendumAndVoteArea who={detail.who} wish={detail.wish} />
        </div>
      </SecondaryCard>
    );
  }
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      {referenda.map((referendum, index) => (
        <SecondaryCard key={index} className="!p-4">
          <ReferendumVoteItem key={index} referendumIndex={referendum.index} />
        </SecondaryCard>
      ))}
    </div>
  );
}

function ReferendumVoteItem({ referendumIndex }) {
  return (
    <div className="flex items-center justify-between text14Medium max-sm:flex-col max-sm:gap-y-3">
      <div className="flex flex-col gap-[4px]">
        <FellowshipReferendumTitleImpl referendumIndex={referendumIndex} />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteButtonsArea referendumIndex={referendumIndex} />
    </div>
  );
}
