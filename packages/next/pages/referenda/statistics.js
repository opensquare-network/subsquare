import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import ReferendaStatistics from "next-common/components/statistics/referenda";
import ReferendaSummary from "next-common/components/statistics/referenda/summary";
import DetailLayout from "next-common/components/layout/DetailLayout";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import OpenGovTurnoutSummary from "next-common/components/statistics/referenda/turnoutSummary";

export default withLoginUserRedux(({ tracksStats, delegatee, summary }) => {
  return (
    <DetailLayout
      seoInfo={{
        title: "OpenGov Statistics",
        desc: "OpenGov Statistics",
      }}
    >
      <BreadcrumbWrapper>
        <Breadcrumb
          items={[
            {
              path: "/referenda",
              content: "Referenda",
            },
            {
              content: "Statistics",
            },
          ]}
        />
      </BreadcrumbWrapper>
      <ReferendaSummary summary={summary} />
      <OpenGovTurnoutSummary summary={summary} />
      <ReferendaStatistics tracks={tracksStats} delegatee={delegatee} />
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [{ result: tracksStats }, { result: delegatee }, { result: summary }] =
    await Promise.all([
      ssrNextApi.fetch("referenda/tracks"),
      ssrNextApi.fetch("referenda/delegatee", {
        sort: JSON.stringify(["votes", "desc"]),
        pageSize: 25,
      }),
      ssrNextApi.fetch("referenda/summary"),
    ]);

  return {
    props: {
      tracksStats: tracksStats ?? [],
      delegatee: delegatee ?? EmptyList,
      summary: summary ?? [],
    },
  };
});
