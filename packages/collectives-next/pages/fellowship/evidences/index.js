import ListLayout from "next-common/components/layout/ListLayout";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import FellowshipEvidencesList from "./list";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";

export default function FellowshipEvidencesPage() {
  return (
    <ListLayout title="Fellowship Evidences">
      <DropdownUrlFilterProvider
        defaultFilterValues={{
          rank: null,
          active_only: false,
        }}
        emptyFilterValues={{
          rank: null,
          active_only: false,
        }}
      >
        <FellowshipEvidencesList />
      </DropdownUrlFilterProvider>
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
