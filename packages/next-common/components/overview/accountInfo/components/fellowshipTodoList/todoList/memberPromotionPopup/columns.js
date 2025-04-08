import Link from "next/link";
import { isNil, startCase } from "lodash-es";
import { useMemo, useState } from "react";
import { AddressUser } from "next-common/components/user";
import { useContextCollectivesMembers } from "../../context/collectivesMember";
import { useContextCoreMembers } from "../../context/coreMembers";
import dynamicPopup from "next-common/lib/dynamic/popup";
import FellowshipRank from "next-common/components/fellowship/rank";
import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreateReferendumAndVoteButton from "./createReferendumAndVoteButton";
import useCollectiveMember from "../../hooks/useCollectiveMember";
import Tooltip from "next-common/components/tooltip";
import { useSubFellowshipVote } from "next-common/utils/hooks/fellowship/useFellowshipVote";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { cn } from "next-common/utils";
import { useValueFromBatchResult } from "next-common/context/batch";
import { usePageProps } from "next-common/context/page";
import Loading from "next-common/components/loading";

const EvidenceDetailPopup = dynamicPopup(() =>
  import("next-common/components/collectives/core/member/evidence"),
);

function ViewEvidence({ evidence, who }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { members: collectiveMembers } = useContextCollectivesMembers();
  const { members: coreMembers } = useContextCoreMembers();
  const rankMember = useMemo(
    () => collectiveMembers.find((m) => m.address === who),
    [collectiveMembers, who],
  );
  const coreMember = useMemo(
    () => coreMembers.find((m) => m.address === who),
    [coreMembers, who],
  );

  return (
    <>
      <div
        role="button"
        className="text-theme500"
        onClick={() => setDetailOpen(true)}
      >
        View Detail
      </div>
      {detailOpen && (
        <EvidenceDetailPopup
          address={who}
          rank={rankMember?.rank}
          isActive={coreMember?.status.isActive}
          wish={evidence[0]}
          evidence={evidence[1]}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

function Rank({ address }) {
  const member = useCollectiveMember(address);
  if (!member) {
    return null;
  }

  return <FellowshipRank rank={member?.rank} />;
}

export const rankColumn = {
  key: "rank",
  name: "Rank",
  style: { width: "60px" },
  render: (item) => <Rank address={item.who} />,
};

export const addressColumn = {
  key: "member",
  name: "Member",
  style: { width: "212px" },
  render: (item) => <AddressUser add={item.who} maxWidth={160} />,
};

export const evidenceColumn = {
  key: "evidence",
  name: "Evidence",
  render: (item) => <ViewEvidence {...item} />,
};

function ReferendaTooltip({ referendumIndex, children }) {
  const { fellowshipTracks } = usePageProps();
  const { value, loading } = useValueFromBatchResult(referendumIndex);
  const trackId = value?.track;
  const referendumTrack = useMemo(
    () => fellowshipTracks.find((track) => track.id === trackId),
    [trackId, fellowshipTracks],
  );

  if (loading) {
    return <Tooltip content={<Loading size={16} />}>{children}</Tooltip>;
  }

  return (
    <Tooltip
      content={
        <div>
          <div>
            Referendum:{" "}
            {value.title ||
              `[${startCase(
                referendumTrack?.name,
              )}] Referendum #${referendumIndex}`}
          </div>
          <div>Comments: {value.commentsCount || 0}</div>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}

export const referendumColumn = {
  key: "referenda",
  name: "Referenda",
  style: { width: "120px" },
  render: (item) => {
    if (isNil(item.referendumIndex)) {
      return <span className="text-textTertiary">-</span>;
    }
    return (
      <ReferendaTooltip referendumIndex={item.referendumIndex}>
        <Link
          className="text-sapphire500"
          href={`/fellowship/referenda/${item.referendumIndex}`}
        >
          #{item.referendumIndex}
        </Link>
      </ReferendaTooltip>
    );
  },
};

function MyVote({ referendumIndex }) {
  const realAddress = useRealAddress();
  const { result: myVote } = useSubFellowshipVote(referendumIndex, realAddress);
  const vote = myVote?.toJSON();

  if (!vote) {
    return null;
  }

  const tooltipContent = (
    <ul>
      <li>Vote: {"aye" in vote ? "Aye" : "Nay"}</li>
      <li>Votes: {"aye" in vote ? vote.aye : vote.nay}</li>
    </ul>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div className="p-[4px]">
        <div
          className={cn(
            "w-[6px] h-[6px] rounded-full",
            vote.aye ? "bg-green500" : "bg-red500",
          )}
        />
      </div>
    </Tooltip>
  );
}

function VoteButtons({ who, referendumIndex, action }) {
  const realAddress = useRealAddress();
  const me = useCollectiveMember(realAddress);
  const myRank = me?.rank;
  const targetMember = useCollectiveMember(who);
  const rank = targetMember?.rank;
  const hasReferendum = !isNil(referendumIndex);

  let tooltipContent = "";
  let disabled = false;
  if (hasReferendum) {
    // do nothing
  } else if (rank <= 0 && action === "approve") {
    tooltipContent = "Can't retain for rank 0";
    disabled = true;
  } else if (rank >= 6 && action === "promote") {
    tooltipContent =
      "Cannot promote because the member is already at the highest rank";
    disabled = true;
  } else if (myRank >= 3) {
    tooltipContent = "Create a new referendum and vote";
    disabled = false;
  } else {
    tooltipContent = "Only rank >=3 can create a referendum and then vote";
    disabled = true;
  }

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <MyVote referendumIndex={referendumIndex} />

      <Tooltip content={tooltipContent}>
        <CreateReferendumAndVoteButton
          address={who}
          rank={rank}
          referendumIndex={referendumIndex}
          action={action}
          voteAye={false}
          disabled={disabled}
        >
          <SystemVoteNay className="w-[16px]" />
        </CreateReferendumAndVoteButton>
      </Tooltip>

      <Tooltip content={tooltipContent}>
        <CreateReferendumAndVoteButton
          address={who}
          rank={rank}
          referendumIndex={referendumIndex}
          action={action}
          voteAye={true}
          disabled={disabled}
        >
          <SystemVoteAye className="w-[16px]" />
        </CreateReferendumAndVoteButton>
      </Tooltip>
    </div>
  );
}

export const votePromoteColumn = {
  key: "vote",
  name: "Vote",
  style: { width: "100px" },
  render: (item) => (
    <VoteButtons
      who={item.who}
      referendumIndex={item.referendumIndex}
      action="promote"
    />
  ),
};

export const voteRetainColumn = {
  key: "vote",
  name: "Vote",
  style: { width: "100px" },
  render: (item) => (
    <VoteButtons
      who={item.who}
      referendumIndex={item.referendumIndex}
      action="approve"
    />
  ),
};
