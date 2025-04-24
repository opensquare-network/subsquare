import LoadableContent from "next-common/components/common/loadableContent";
import ListLayout from "next-common/components/layout/ListLayout";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import useRegistrarsList from "next-common/utils/hooks/useRegistrars";
import RegistrarsTable from "./table";

export default function PeopleRegistrarsPage() {
  const { registrars = [], isLoading = false } = useRegistrarsList();
  return (
    <ListLayout
      title="Registrars"
      description="An entity or individual authorized to verify and validate the identity of accounts. Registrars can set a fee for their services and limit their attestation to certain fields."
      summary={
        <RegistrarsSummary isLoading={isLoading} total={registrars.length} />
      }
    >
      <RegistrarsTable
        registrars={registrars}
        isLoading={isLoading}
        total={registrars.length}
      />
    </ListLayout>
  );
}

function RegistrarsSummary({ isLoading = false, total = "-" }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <LoadableContent isLoading={isLoading}>{total}</LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
