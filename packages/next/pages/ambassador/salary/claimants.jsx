import FellowshipSalaryClaimantsContainer from "next-common/components/fellowship/salary/claimants/container";
import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";

export default function AmbassadorSalaryCalimantsPage() {
  return (
    <FellowshipSalaryCommon section="ambassador">
      <FellowshipSalaryClaimantsContainer />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps();
