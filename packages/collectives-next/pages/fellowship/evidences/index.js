import ListLayout from "next-common/components/layout/ListLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import FellowshipEvidencesTable from "next-common/components/fellowship/evidences/table";
import useRankFilter from "next-common/components/fellowship/evidences/useRankFilter";

export default function FellowshipEvidencesPage() {
  const { evidences } = usePageProps();
  const { component: RankFilterComponent, filteredEvidences } =
    useRankFilter(evidences);

  const evidencesCount = evidences?.length || 0;

  return (
    <ListLayout title="Fellowship Evidences">
      <div className="flex flex-wrap max-md:flex-col md:items-center gap-[12px] max-md:gap-[16px] justify-between pr-6 mb-4">
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text14Medium ml-1">
              {evidencesCount}
            </span>
          </span>
        </TitleContainer>
        {RankFilterComponent}
      </div>

      <FellowshipEvidencesTable evidences={filteredEvidences} />
    </ListLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [{ result: evidences }, { result: summary }] = await Promise.all([
    backendApi.fetch("/fellowship/members/evidences"),
    backendApi.fetch("overview/summary"),
  ]);

  return {
    props: {
      evidences,
      summary: summary ?? {},
    },
  };
});
