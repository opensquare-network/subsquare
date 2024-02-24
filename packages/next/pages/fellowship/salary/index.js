import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { ssrNextApi } from "next-common/services/nextApi";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";

export default function FellowshipSalaryPage() {
  return <FellowshipSalaryCommon>Salary cycles</FellowshipSalaryCommon>;
}

export const getServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: historyCycles = {} }, { result: activeCycle }] =
    await Promise.all([
      fetchOpenGovTracksProps(),
      ssrNextApi.fetch("fellowship/salary/history_cycles"),
      ssrNextApi.fetch("fellowship/salary/active_cycle"),
    ]);

  return {
    props: {
      ...tracksProps,
      historyCycles,
      activeCycle,
    },
  };
});
