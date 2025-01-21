import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import CollectivesProvider from "next-common/context/collectives/collectives";
import FellowshipMembersInContext from "next-common/components/fellowship/members";

export default function SimpleFellowshipMembersPage() {
  const { fellowshipParams } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <ListLayout seoInfo={seoInfo} title={category}>
        <FellowshipMembersInContext />
      </ListLayout>
    </CollectivesProvider>
  );
}
