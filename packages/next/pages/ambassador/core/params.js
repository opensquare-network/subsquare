import getAmbassadorParamsServerSideProps from "next-common/services/serverSide/ambassador/params";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";

export default function AmbassadorCoreParamsPage({ ambassadorParams }) {
  return (
    <AmbassadorCoreCommon>
      <FellowshipCoreParamsContainer params={ambassadorParams} />
    </AmbassadorCoreCommon>
  );
}

export const getServerSideProps = getAmbassadorParamsServerSideProps;
