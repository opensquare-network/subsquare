import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipSalaryCyclesLayout from "next-common/components/fellowship/salary/cycles/layout";

export default function FellowshipSalaryCyclePage() {
  return (
    <FellowshipSalaryCyclesLayout>
      <div>Salary Cycle detail</div>
    </FellowshipSalaryCyclesLayout>
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
