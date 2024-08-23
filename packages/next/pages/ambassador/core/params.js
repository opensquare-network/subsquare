import getAmbassadorParamsServerSideProps from "next-common/services/serverSide/ambassador/params";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function AmbassadorCoreParamsPage({ ambassadorParams }) {
  return (
    <CollectivesProvider section="ambassador">
      <FellowshipCoreCommon>
        <FellowshipCoreParamsContainer params={ambassadorParams} />
      </FellowshipCoreCommon>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getAmbassadorParamsServerSideProps;
