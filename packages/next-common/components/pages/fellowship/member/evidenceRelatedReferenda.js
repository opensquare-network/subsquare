import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import { CreateReferendumAndVote } from "./fellowshipMember/wishDetail";
import { FellowshipReferendumTitleImpl } from "next-common/components/fellowshipReferendumTitle";
import { ReferendumVoteButtons } from "./fellowshipMember/voteButtons";
import MyVote from "./fellowshipMember/myVote";
import tw from "tailwind-styled-components";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useFetch from "next-common/hooks/useFetch";
import {
  gov2FinalState,
  gov2State,
  gov2VotingStates,
} from "next-common/utils/consts/state";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { ActiveReferendaProvider } from "next-common/context/activeReferenda";
import CollectivesMembersProvider from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/collectivesMember";
import { isNil } from "lodash-es";
import { useMemo } from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { Gov2ReferendaTag } from "next-common/components/tags/state/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { useIsWeb3User } from "next-common/context/user";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";

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
  const isWeb3User = useIsWeb3User();
  const { detail } = usePageProps() || {};
  const { who, wish } = detail || {};

  const wishMethods = useMemo(() => {
    if (wish === "Retention") return ["approve"];
    if (wish === "PromotionRequest") return ["promote", "promoteFast"];
    return ["approve", "promote", "promoteFast"];
  }, [wish]);

  const { relatedReferenda, isLoading } = useRelatedReferenda(who, wishMethods);

  const canCreateReferendum = useMemo(() => {
    const isOnChain =
      isNil(detail?.cid) && isNil(detail?.content) && isNil(detail?.hex);
    return !isOnChain && relatedReferenda.length === 0 && isWeb3User;
  }, [detail, relatedReferenda, isWeb3User]);

  if (isLoading) {
    return (
      <SecondaryCard className="!p-4">
        <div className="flex items-center min-h-[40px]">
          <FieldLoading size={20} />
        </div>
      </SecondaryCard>
    );
  }

  if (relatedReferenda.length === 0) {
    return (
      <SecondaryCard className="!p-4">
        <div className="flex gap-x-[16px] justify-between items-center max-sm:flex-col max-sm:gap-y-3 min-h-[40px]">
          <p className="text-textTertiary text14Medium w-full max-sm:text-center">
            No referendum was created
          </p>
          {canCreateReferendum && (
            <CreateReferendumAndVoteArea who={detail.who} wish={detail.wish} />
          )}
        </div>
      </SecondaryCard>
    );
  }

  return relatedReferenda.map(({ referendumIndex }, index) => (
    <SecondaryCard key={index} className="!p-4">
      <ReferendumVoteItem referendumIndex={referendumIndex} />
    </SecondaryCard>
  ));
}

function EvidenceReferendaFromDB({ referenda }) {
  if (referenda.length === 0) {
    return (
      <SecondaryCard className="!p-4">
        <div className="flex items-center min-h-[40px]">
          <p className="text-textTertiary text14Medium w-full max-sm:text-center">
            No referendum was created
          </p>
        </div>
      </SecondaryCard>
    );
  }

  return referenda.map((referendum, index) => (
    <SecondaryCard key={index} className="!p-4">
      <ReferendumVoteItem referendumIndex={referendum.index} />
    </SecondaryCard>
  ));
}

export default function EvidenceRelatedReferenda() {
  const { detail } = usePageProps() || {};

  if (!detail) {
    return null;
  }

  const { referenda: detailReferenda = [], isActive } = detail;
  // Only query the chain when the scanner has no linked referenda AND the
  // evidence is still active — the common case where a new evidence was
  // submitted after the referendum was already created.
  const needsChainFallback = detailReferenda.length === 0 && isActive;

  return (
    <div className="flex flex-col gap-y-4 mt-6">
      <label className="text-textPrimary text14Bold">Related Referendum</label>
      <CollectivesProvider>
        <CollectivesMembersProvider>
          {needsChainFallback ? (
            <ActiveReferendaProvider pallet="fellowshipReferenda">
              <EvidenceRelatedReferendaImpl />
            </ActiveReferendaProvider>
          ) : (
            <EvidenceReferendaFromDB referenda={detailReferenda} />
          )}
        </CollectivesMembersProvider>
      </CollectivesProvider>
    </div>
  );
}

function ReferendumVoteItem({ referendumIndex }) {
  const { section } = useCollectivesContext();
  const { value: detail, loading } = useFetch(
    `/api/${section}/referenda/${referendumIndex}`,
  );

  return (
    <div className="flex items-center justify-between w-full text14Medium gap-x-4 max-sm:flex-col max-sm:gap-y-3">
      <div className="flex flex-col gap-[4px] flex-1 min-w-0 w-full min-h-[40px] justify-center">
        <ReferendumTitleWrapper
          referendumIndex={referendumIndex}
          title={detail?.title}
          loading={loading}
          linkTarget="_self"
        />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteItemRight
        state={detail?.state}
        referendumIndex={referendumIndex}
      />
    </div>
  );
}

function ReferendumVoteItemRight({ state, referendumIndex }) {
  const isVoting = gov2VotingStates.includes(state?.name);

  const isFinal = [...gov2FinalState, gov2State.Executed].includes(state?.name);

  if (isVoting) {
    return <ReferendumVoteButtonsArea referendumIndex={referendumIndex} />;
  } else if (isFinal) {
    const args = getGov2ReferendumStateArgs(state);
    return <Gov2ReferendaTag state={state?.name} args={args} />;
  } else {
    return null;
  }
}
