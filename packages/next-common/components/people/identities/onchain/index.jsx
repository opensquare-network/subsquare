import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import IdentitiesTable from "./table";
import { CommonIdentitiesSummaryCard } from "../summary";
import { tabs } from "../index";
import useOnchainPeopleIdentityList from "next-common/hooks/people/useOnchainPeopleIdentityList";
import useOnchainPeopleIdentityInfo from "next-common/hooks/people/useOnchainPeopleIdentityInfo";

export default function OnchainPeopleIdentitiesPage() {
  const { description } = useChainSettings();
  const { data: identitieList, isLoading } = useOnchainPeopleIdentityList();
  const { stats, isLoading: isSummaryLoading } =
    useOnchainPeopleIdentityInfo(identitieList);

  return (
    <ListLayout
      title="Identities"
      description={description}
      headContent={<ChainSocialLinks />}
      summary={
        <CommonIdentitiesSummaryCard
          identityDetail={stats}
          isLoading={isSummaryLoading}
        />
      }
      tabs={tabs}
    >
      <div className="space-y-6">
        <IdentitiesTable identitieList={identitieList} isLoading={isLoading} />
      </div>
    </ListLayout>
  );
}
