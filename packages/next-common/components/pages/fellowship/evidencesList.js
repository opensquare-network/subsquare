import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipEvidencesTable from "next-common/components/fellowship/evidences/table";
import useEvidencesSort from "next-common/components/fellowship/evidences/useEvidencesSort";
import useEvidenceFilter from "next-common/components/pages/fellowship/useEvidenceFilter";
import { usePageProps } from "next-common/context/page";
import PrimaryButton from "next-common/lib/button/primary";
import { useMemo, useState } from "react";
import { SystemPlus } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Tooltip from "next-common/components/tooltip";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

const SubmitEvidencePopup = dynamicPopup(() =>
  import(
    "next-common/components/collectives/core/actions/more/submitEvidenceItem/popup"
  ),
);

export default function FellowshipEvidencesList() {
  const { evidences } = usePageProps();

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
          <NewEvidenceButton />
        </div>
      </div>

      <FellowshipEvidencesTable evidences={filteredEvidences} />
    </>
  );
}

function NewEvidenceButton() {
  const [showSubmitEvidencePopup, setShowSubmitEvidencePopup] = useState(false);
  const { fellowshipMembers = [], ambassadorMembers = [] } = usePageProps();
  const realAddress = useRealAddress();
  const section = useCollectivesSection();

  const canSubmitEvidence = useMemo(() => {
    if (section === "fellowship") {
      return fellowshipMembers.some((member) => member.address === realAddress);
    } else if (section === "ambassador") {
      return ambassadorMembers.some((member) => member.address === realAddress);
    }
    return false;
  }, [fellowshipMembers, ambassadorMembers, realAddress, section]);

  let buttonCompnent = (
    <PrimaryButton
      disabled={!canSubmitEvidence}
      onClick={() => setShowSubmitEvidencePopup(true)}
      size="small"
      iconLeft={<SystemPlus className="w-4 h-4" />}
    >
      New Evidence
    </PrimaryButton>
  );

  if (!canSubmitEvidence) {
    buttonCompnent = (
      <Tooltip content="Only members can create a new evidence">
        {buttonCompnent}
      </Tooltip>
    );
  }

  return (
    <>
      {buttonCompnent}
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
