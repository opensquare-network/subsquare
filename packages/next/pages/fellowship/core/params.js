import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import FellowshipCoreParamsContainer from "next-common/components/fellowship/params/container";
import getFellowshipMembersServerSideProps from "next-common/services/serverSide/fellowship/members";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { usePageProps } from "next-common/context/page";

export default function FellowshipCoreParamsPage({ fellowshipParams }) {
  const { fellowshipMembers } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);

  return (
    <FellowshipCoreCommon>
      <FellowshipCoreParamsContainer params={fellowshipParams} />
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = getFellowshipMembersServerSideProps;
