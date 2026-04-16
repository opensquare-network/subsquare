import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import SecretarySalaryClaimantsContainer from "next-common/components/secretary/salary/claimants/container";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";

export default function SecretarySalaryClaimantsPage() {
  return (
    <FellowshipSalaryCommon section="secretary">
      <SecretarySalaryClaimantsContainer />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps();
