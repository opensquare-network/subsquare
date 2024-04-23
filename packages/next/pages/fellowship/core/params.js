import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import getFellowshipParamsServerSideProps from "next-common/services/serverSide/fellowship/params";

export default function FellowshipCoreParamsPage({ fellowshipParams }) {
  return (
    <FellowshipCoreCommon>
      <FellowshipCoreParamsContainer params={fellowshipParams} />
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = getFellowshipParamsServerSideProps;
