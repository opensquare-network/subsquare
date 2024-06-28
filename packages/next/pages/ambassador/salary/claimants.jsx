import AmbassadorSalaryCommon from "next-common/components/ambassador/common";
import AmbassadorSalaryClaimantsContainer from "next-common/components/ambassador/salary/claimants/container";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";

export default function AmbassadorSalaryCalimantsPage() {
  return (
    <AmbassadorSalaryCommon>
      <AmbassadorSalaryClaimantsContainer />
    </AmbassadorSalaryCommon>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps();
