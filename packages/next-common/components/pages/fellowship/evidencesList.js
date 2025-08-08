import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipEvidencesTable from "next-common/components/fellowship/evidences/table";
import useEvidencesSort from "next-common/components/fellowship/evidences/useEvidencesSort";
import useEvidenceFilter from "next-common/components/pages/fellowship/useEvidenceFilter";
import { usePageProps } from "next-common/context/page";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

function FellowshipEvidencesListImpl({ evidences }) {
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
        {EvidenceFilterComponent}
      </div>

      <FellowshipEvidencesTable evidences={filteredEvidences} />
    </>
  );
}

export default function FellowshipEvidencesList() {
  const { evidences } = usePageProps();
  const chain = useChain();

  if (chain !== Chains.Collectives) {
    return null;
  }

  return <FellowshipEvidencesListImpl evidences={evidences} />;
}
