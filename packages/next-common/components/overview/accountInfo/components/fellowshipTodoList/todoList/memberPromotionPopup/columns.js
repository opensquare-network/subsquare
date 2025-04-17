import Link from "next/link";
import { isNil, startCase } from "lodash-es";
import { useMemo, useState } from "react";
import { AddressUser } from "next-common/components/user";
import { useContextCollectivesMembers } from "../../context/collectivesMember";
import { useContextCoreMembers } from "../../context/coreMembers";
import dynamicPopup from "next-common/lib/dynamic/popup";
import FellowshipRank from "next-common/components/fellowship/rank";
import useCollectiveMember from "../../hooks/useCollectiveMember";
import Tooltip from "next-common/components/tooltip";
import { useValueFromBatchResult } from "next-common/context/batch";
import { usePageProps } from "next-common/context/page";
import Loading from "next-common/components/loading";
import VoteButtonsWithoutReferendum from "./voteButtons/voteButtonsWithoutReferendum";
import ReferendumVoteButtons from "./voteButtons/referendumVoteButtons";

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
        className="inline-block text-theme500"
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

  if (!value) {
    return children;
  }

  return (
    <Tooltip
      content={
        <div>
          <div>
            Title:{" "}
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

export const votePromoteColumn = {
  key: "vote",
  name: "Vote",
  style: { width: "100px", textAlign: "right" },
  render: (item) =>
    isNil(item.referendumIndex) ? (
      <VoteButtonsWithoutReferendum who={item.who} action="promote" />
    ) : (
      <ReferendumVoteButtons referendumIndex={item.referendumIndex} />
    ),
};

export const voteRetainColumn = {
  key: "vote",
  name: "Vote",
  style: { width: "100px", textAlign: "right" },
  render: (item) =>
    isNil(item.referendumIndex) ? (
      <VoteButtonsWithoutReferendum who={item.who} action="approve" />
    ) : (
      <ReferendumVoteButtons referendumIndex={item.referendumIndex} />
    ),
};
