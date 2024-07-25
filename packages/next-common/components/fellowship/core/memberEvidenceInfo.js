import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import styled from "styled-components";

const InfoItem = styled.li`
  padding-left: 1em;
`;

export default function MemberEvidenceInfo({ className }) {
  const { evidences, isLoading } = useEvidencesCombineReferenda();

  if (isLoading) {
    return null;
  }

  const totalEvidences = evidences.length || 0;
  const evidencesToBeHandled =
    evidences.filter((evidence) => isNil(evidence.referendumIndex)).length || 0;

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
            <InfoItem>
              {evidencesToBeHandled} evidences to be handled in total{" "}
              {totalEvidences} evidences.
            </InfoItem>
            <InfoItem>
              The demotion period for 12 members is approaching.
            </InfoItem>
            <InfoItem>Promotions are available for 3 members.</InfoItem>
          </ul>
        </div>
      </div>
    </SecondaryCard>
  );
}
