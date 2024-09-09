import ListLayout from "next-common/components/layout/ListLayout";
import MembersNoElections from "components/council/membersNoElections";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CollectiveProvider from "next-common/context/collective";
import { useChain } from "next-common/context/chain";

export default function MembersPage() {
  const category = "Council Members";
  const seoInfo = { title: category, desc: category };
  const chain = useChain();

  let pallet = "council";
  if (["karura", "acala"].includes(chain)) {
    pallet = "generalCouncil";
  }

  return (
    <CollectiveProvider pallet={pallet}>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        description="Council members"
      >
        <MembersNoElections />
      </ListLayout>
    </CollectiveProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
