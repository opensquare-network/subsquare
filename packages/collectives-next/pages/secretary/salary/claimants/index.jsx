import SecretarySalaryCommon from "next-common/components/secretary/salary/common";
import SecretarySalaryClaimantsContainer from "next-common/components/secretary/salary/claimants/container";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";

export default function SecretarySalaryClaimantsPage() {
  return (
    <SecretarySalaryCommon>
      <SecretarySalaryClaimantsContainer />
    </SecretarySalaryCommon>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps();
