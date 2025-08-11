import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipEvidencesTable from "next-common/components/fellowship/evidences/table";
import useEvidencesSort from "next-common/components/fellowship/evidences/useEvidencesSort";
import useEvidenceFilter from "next-common/components/pages/fellowship/useEvidenceFilter";
import SubmitEvidencePopup from "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup";
import { usePageProps } from "next-common/context/page";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";
import { SystemPlus } from "@osn/icons/subsquare";

export default function FellowshipEvidencesList() {
  const { evidences } = usePageProps();
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);

  const { component: EvidenceFilterComponent, filteredEvidences } =
    useEvidenceFilter(evidences);

  const sortedEvidences = useEvidencesSort(filteredEvidences);

  const evidencesCount = sortedEvidences?.length || 0;
  return (
    <>
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6 mb-4">
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text14Medium ml-1">
              {evidencesCount}
            </span>
          </span>
        </TitleContainer>
        <div className="flex items-center gap-3 max-md:pl-6">
          {EvidenceFilterComponent}
          <PrimaryButton
            onClick={() => setShowSubmitEvidencePopup(true)}
            size="small"
            iconLeft={<SystemPlus className="w-4 h-4" />}
          >
            New Evidence
          </PrimaryButton>
        </div>
      </div>

      <FellowshipEvidencesTable evidences={filteredEvidences} />
      {showSubmitEvidencePopup && (
        <SubmitEvidencePopup
          onClose={() => {
            setShowSubmitEvidencePopup(false);
          }}
        />
      )}
    </>
  );
}
