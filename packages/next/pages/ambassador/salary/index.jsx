import AmbassadorSalaryCommon from "next-common/components/ambassador/common";
import { withAmbassadorSalaryCommonProps } from "next-common/services/serverSide/ambassador/common";

export default function AmbassadorSalaryPage() {
  return (
    <AmbassadorSalaryCommon>
      <div></div>
    </AmbassadorSalaryCommon>
  );
}

export const getServerSideProps = withAmbassadorSalaryCommonProps(async () => {
  return {};
});
