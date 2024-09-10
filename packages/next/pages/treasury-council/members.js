import MembersNoElections from "components/council/membersNoElections";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CollectiveProvider, { collectivePallets } from "next-common/context/collective";

export default function MembersPage() {
  const category = "Treasury Council Members";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectiveProvider pallet={collectivePallets.treasuryCouncilCollective}>
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        description="Treasury council members"
      >
        <MembersNoElections
          category={category}
          type={detailPageCategory.TREASURY_COUNCIL_MOTION}
        />
      </ListLayout>
    </CollectiveProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
