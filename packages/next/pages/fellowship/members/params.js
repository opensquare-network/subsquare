import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import CollectivesProvider from "next-common/context/collectives/collectives";
import getFellowshipParamsServerSideProps from "next-common/services/serverSide/fellowship/params";

export default function FellowshipCoreParamsPage({ fellowshipParams }) {
  return (
    <CollectivesProvider section="fellowship">
      <FellowshipCoreCommon>
        <FellowshipCoreParamsContainer params={fellowshipParams} />
      </FellowshipCoreCommon>
    </CollectivesProvider>
  );
}

export const getServerSideProps = getFellowshipParamsServerSideProps;
