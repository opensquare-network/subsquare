import Link from "next/link";
import { isNil } from "lodash-es";
import { useMemo, useState } from "react";
import { AddressUser } from "next-common/components/user";
import { useContextCollectivesMembers } from "../../context/collectivesMember";
import { useContextCoreMembers } from "../../context/coreMembers";
import dynamicPopup from "next-common/lib/dynamic/popup";
import FellowshipRank from "next-common/components/fellowship/rank";

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
          rank={rankMember.rank}
          isActive={coreMember.status.isActive}
          wish={evidence[0]}
          evidence={evidence[1]}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

function Rank({ address }) {
  const { members: collectiveMembers } = useContextCollectivesMembers();
  const rankMember = useMemo(
    () => collectiveMembers.find((m) => m.address === address),
    [collectiveMembers, address],
  );

  return <FellowshipRank rank={rankMember.rank} />;
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

export const referendumColumn = {
  key: "referenda",
  name: "Referenda",
  style: { width: "120px" },
  render: (item) => {
    if (isNil(item.referendumIndex)) {
      return <span className="text-textTertiary">-</span>;
    }
    return (
      <Link
        className="text-sapphire500"
        href={`/fellowship/${item.referendumIndex}`}
      >
        #{item.referendumIndex}
      </Link>
    );
  },
};
