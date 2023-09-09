import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import MembersNoElections from "components/council/membersNoElections";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import ListLayout from "next-common/components/layout/ListLayout";

export default withLoginUserRedux(() => {
  const category = "Open Tech. Comm. Members";
  const seoInfo = { title: category, desc: category };

  return (
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
  );
});

export const getServerSideProps = withLoginUser();
