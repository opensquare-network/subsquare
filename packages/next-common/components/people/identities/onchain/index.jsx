import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import IdentitiesTable from "./table";
import IdentitiesSummary from "../summary";
import { tabs } from "../index";

export default function OnchainPeopleIdentitiesPage() {
  const { description } = useChainSettings();

  return (
    <ListLayout
      title="Identities"
      description={description}
      headContent={<ChainSocialLinks />}
      summary={<IdentitiesSummary />} // todo: add summary
      tabs={tabs}
    >
      <div className="space-y-6">
        <IdentitiesTable />
      </div>
    </ListLayout>
  );
}
