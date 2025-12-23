import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import ChainSocialLinks from "next-common/components/chain/socialLinks";
import IdentitiesTable from "./table";
import OnchainPeopleIdentitiesPage from "./onchain";
import IdentitiesSummary from "./summary";
import PeopleCommonProvider from "../common/commonProvider";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import {
  isKusamaPeopleChain,
  isPaseoPeopleChain,
  isPolkadotPeopleChain,
  isWestendPeopleChain,
} from "next-common/utils/chain";

export const tabs = [
  {
    value: "identities",
    label: "Identities",
    url: "/people/identities",
    exactMatch: false,
  },
];

export default function PeopleIdentitiesPageImpl() {
  const { description, value: chain } = useChainSettings();

  if (
    isPolkadotPeopleChain(chain) ||
    isKusamaPeopleChain(chain) ||
    isWestendPeopleChain(chain) ||
    isPaseoPeopleChain(chain)
  ) {
    return (
      <PeopleCommonProvider>
        <OnchainPeopleIdentitiesPage />
      </PeopleCommonProvider>
    );
  }

  return (
    <PeopleCommonProvider>
      <ListLayout
        title="Identities"
        seoInfo={{ rawTitle: generateLayoutRawTitle("People Identities") }}
        description={description}
        headContent={<ChainSocialLinks />}
        summary={<IdentitiesSummary />}
        tabs={tabs}
      >
        <div className="space-y-6">
          <IdentitiesTable />
        </div>
      </ListLayout>
    </PeopleCommonProvider>
  );
}
