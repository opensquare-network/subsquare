import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import getFellowshipParamsServerSideProps from "next-common/services/serverSide/fellowship/params";

export default function FellowshipCoreParamsPage({ fellowshipParams }) {
  useFetchFellowshipCoreMembers();

  return (
    <FellowshipCoreCommon>
      <FellowshipCoreParamsContainer params={fellowshipParams} />
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = getFellowshipParamsServerSideProps;
