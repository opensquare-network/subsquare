import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryClaimantsContainer from "next-common/components/fellowship/salary/claimants/container";
import { withFellowshipSalaryCommonProps } from "next-common/services/serverSide/fellowship/common";

export default function FellowshipSalaryClaimantsPage() {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryClaimantsContainer />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withFellowshipSalaryCommonProps();
