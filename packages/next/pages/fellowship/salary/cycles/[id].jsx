import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipSalaryCycleLayout from "next-common/components/fellowship/salary/cycles/layout";

export default function FellowshipSalaryCyclePage() {
  return (
    <FellowshipSalaryCycleLayout>
      <div>Salary Cycle detail</div>
    </FellowshipSalaryCycleLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [tracksProps] = await Promise.all([fetchOpenGovTracksProps()]);

  return {
    props: {
      ...tracksProps,
    },
  };
});
