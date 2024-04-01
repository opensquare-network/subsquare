import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryClaimantsContainer from "next-common/components/fellowship/salary/claimants/container";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function FellowshipSalaryClaimantsPage() {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryClaimantsContainer />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [tracksProps] = await Promise.all([fetchOpenGovTracksProps()]);

  return {
    props: {
      ...tracksProps,
    },
  };
});
