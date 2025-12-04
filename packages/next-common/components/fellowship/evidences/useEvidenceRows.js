import { AddressUser } from "next-common/components/user";
import FellowshipRank from "next-common/components/fellowship/rank";
import EvidenceLink from "next-common/components/profile/fellowship/core/evidence/link";
import { isNil } from "lodash-es";
import Link from "next-common/components/link";
import getEvidenceTitle from "next-common/utils/fellowship/getEvidenceTitle";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export function useEvidencesRows(evidences = []) {
  const realAddress = useRealAddress();
  return evidences.map((evidence, idx) => {
    const { activeEvidence, address, rank, evidencesCount } = evidence;
    const row = [
      <div key={`evidence-row-${idx}`} className="flex items-center gap-x-2">
        {isNil(rank) ? null : (
          <>
            <FellowshipRank rank={rank} />
            <span className="text14Medium text-textTertiary">·</span>
          </>
        )}
        <AddressUser add={address} link="/fellowship" />
      </div>,
      <div key={`title-row-${idx}`} className="max-sm:max-w-[200px]">
        {isNil(activeEvidence) || isNil(rank) ? (
          "-"
        ) : (
          <EvidenceLink
            className="text-left hover:underline"
            tooltipClassName="w-auto max-w-full"
            blockHeight={activeEvidence?.indexer?.blockHeight}
            eventIndex={activeEvidence?.indexer?.eventIndex}
            address={address}
            target="_self"
          >
            {getEvidenceTitle({
              wish: activeEvidence?.wish,
              rank: activeEvidence?.rank,
              title: activeEvidence?.title,
            })}
          </EvidenceLink>
        )}
      </div>,
      <Link
        key={`count-row-${idx}`}
        className="text-right hover:underline"
        href={`/user/${address}/fellowship?evidenceTab=History`}
      >
        {evidencesCount}
      </Link>,
    ];

    if (isSameAddress(address, realAddress)) {
      row.tag = <MineTagOnListView />;
    }

    return row;
  });
}
