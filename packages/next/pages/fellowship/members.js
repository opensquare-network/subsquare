import ListLayout from "next-common/components/layout/ListLayout";
import { usePageProps } from "next-common/context/page";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import FellowshipMembersInContext from "next-common/components/fellowship/members";
import FellowshipCollectiveMembersInContext from "next-common/components/fellowship/collective/members";

function FellowshipMembers() {
  const chain = useChain();

  return isCollectivesChain(chain) ? (
    <FellowshipCollectiveMembersInContext />
  ) : (
    <FellowshipMembersInContext />
  );
}

export default function MembersPage() {
  const { fellowshipParams } = usePageProps();
  const category = "Fellowship Members";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectivesProvider params={fellowshipParams} section="fellowship">
      <ListLayout seoInfo={seoInfo} title={category}>
        <FellowshipMembers />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
