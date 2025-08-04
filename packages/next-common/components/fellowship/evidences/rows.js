import { AddressUser } from "next-common/components/user";
import FellowshipRank from "next-common/components/fellowship/rank";
import EvidenceLink from "next-common/components/profile/fellowship/core/evidence/link";
import { isNil } from "lodash-es";

export function getFellowshipEvidencesRows(evidences = []) {
  return evidences.map((evidence, idx) => {
    const { activeEvidence, address, rank, evidencesCount } = evidence;
    return [
      <div key={`evidence-row-${idx}`} className="flex items-center gap-x-2">
        {isNil(rank) ? null : (
          <>
            <FellowshipRank rank={rank} />
            <span className="text14Medium text-textTertiary">·</span>
          </>
        )}
        <AddressUser add={address} />
      </div>,
      <div key={`title-row-${idx}`} className="max-sm:max-w-[200px]">
        {isNil(activeEvidence) ? (
          "-"
        ) : (
          <EvidenceLink
            className="text-left"
            tooltipClassName="w-auto max-w-full"
            blockHeight={activeEvidence?.indexer?.blockHeight}
            eventIndex={activeEvidence?.indexer?.eventIndex}
            address={address}
          >
            {activeEvidence?.title}
          </EvidenceLink>
        )}
      </div>,
      <div key={`count-row-${idx}`} className="text-right text-textTertiary">
        {evidencesCount}
      </div>,
    ];
  });
}
