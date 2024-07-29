import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";

export default function MemberEvidenceInfo({ className }) {
  const { evidences, isLoading } = useEvidencesCombineReferenda();
  const totalEvidences = (evidences || []).length || 0;
  if (isLoading || totalEvidences <= 0) {
    return null;
  }

  const evidencesToBeHandled = (evidences || []).filter((evidence) =>
    isNil(evidence.referendumIndex),
  ).length;
  return (
    <SecondaryCard className={className}>
      <div className="flex gap-[16px]">
        <div>
          <div className="bg-theme100 rounded-[8px] p-[8px]">
            <MenuHorn
              className="[&_path]:fill-theme500"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="text-textPrimary text14Medium">
          <ul className="list-disc list-inside [&_li]">
            <li className="pl-[1em]">
              {evidencesToBeHandled} evidences to be handled in total{" "}
              {totalEvidences} evidences.
            </li>
          </ul>
        </div>
      </div>
    </SecondaryCard>
  );
}
