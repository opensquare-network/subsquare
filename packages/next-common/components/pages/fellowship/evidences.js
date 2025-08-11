import ListLayout from "next-common/components/layout/ListLayout";
import FellowshipEvidencesList from "./evidencesList";
import { DropdownUrlFilterProvider } from "next-common/components/dropdownFilter/context";
import CollectivesProvider from "next-common/context/collectives/collectives";

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
        <CollectivesProvider section="fellowship">
          <FellowshipEvidencesList />
        </CollectivesProvider>
      </DropdownUrlFilterProvider>
    </ListLayout>
  );
}
