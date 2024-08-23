import getAmbassadorParamsServerSideProps from "next-common/services/serverSide/ambassador/params";
import AmbassadorCoreCommon from "next-common/components/ambassador/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorCoreParamsPage({ ambassadorParams }) {
  return (
    <CollectivesProvider section="ambassador">
      <AmbassadorCoreCommon>
        <FellowshipCoreParamsContainer params={ambassadorParams} />
      </AmbassadorCoreCommon>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getAmbassadorParamsServerSideProps;
