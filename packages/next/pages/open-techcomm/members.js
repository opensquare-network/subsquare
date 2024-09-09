import MembersNoElections from "components/council/membersNoElections";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import CollectiveProvider from "next-common/context/collective";

export default function Members() {
  const category = "Open Tech. Comm. Members";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectiveProvider pallet="openTechCommitteeCollective">
      <ListLayout
        seoInfo={seoInfo}
        title={category}
        description="Open technical committee members"
      >
        <MembersNoElections
          category={category}
          type={detailPageCategory.OPEN_TECH_COMM_PROPOSAL}
        />
      </ListLayout>
    </CollectiveProvider>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
