import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import { withSecretarySalaryCommonProps } from "next-common/services/serverSide/secretary/common";

export default function SecretarySalaryFeedsPage() {
  return (
    <FellowshipSalaryCommon section="secretary">
      <div />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withSecretarySalaryCommonProps();
