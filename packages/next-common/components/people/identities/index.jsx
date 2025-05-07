import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import IdentitiesTable from "./table";
import OnchainPeopleIdentitiesPage from "./onchain";
import IdentitiesSummary from "./summary";

export const tabs = [
  {
    value: "identities",
    label: "Identities",
    url: "/people/identities",
    exactMatch: false,
  },
];

export default function PeopleIdentitiesPageImpl() {
  const { description, integrations } = useChainSettings();

  if (!integrations?.statescan) {
    return <OnchainPeopleIdentitiesPage />;
  }

  return (
    <ListLayout
      title="Identities"
      description={description}
      headContent={<ChainSocialLinks />}
      summary={<IdentitiesSummary />}
      tabs={tabs}
    >
      <div className="space-y-6">
        <IdentitiesTable />
      </div>
    </ListLayout>
  );
}
