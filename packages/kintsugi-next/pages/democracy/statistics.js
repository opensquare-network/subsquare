import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import DetailLayout from "next-common/components/layout/DetailLayout";
import AllVotesStatistics from "components/statistics/democracy/allVoteStatistics";
import TurnoutStatistics from "components/statistics/democracy/turnoutStatistics";

export default withLoginUserRedux(
  ({ turnout }) => {
    return (
      <DetailLayout
        seoInfo={{
          title: "Democracy Statistics",
          desc: "Democracy Statistics",
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={[
              {
                path: "/democracy/referenda",
                content: "Democracy Referenda",
              },
              {
                content: "Statistics",
              },
            ]} />
        </BreadcrumbWrapper>
        <AllVotesStatistics turnout={turnout} />
        <TurnoutStatistics turnout={turnout} />
      </DetailLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const [
    { result: turnout },
  ] = await Promise.all([
    nextApi.fetch("democracy/referenda/turnout"),
  ]);

  return {
    props: {
      turnout: turnout ?? [],
    },
  };
});
