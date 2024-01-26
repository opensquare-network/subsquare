import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import FellowshipCoreCommon from "next-common/components/fellowship/core/common";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
} from "next-common/services/url";
import { usePageProps } from "next-common/context/page";
import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import FellowshipCoreMemberCard from "next-common/components/fellowship/core/members/card";
import { SystemLoading } from "@osn/icons/subsquare";
import isNil from "lodash.isnil";

export default function FellowshipCorePage() {
  const { fellowshipMembers } = usePageProps();
  useFetchFellowshipCoreMembers(fellowshipMembers);
  const members = useSelector(fellowshipCoreMembersSelector);

  return (
    <FellowshipCoreCommon>
      {isNil(members) && (
        <SystemLoading className="[&_path]:stroke-textTertiary mx-auto" />
      )}
      <div className="flex flex-col gap-y-4">
        {(members || []).map((member) => {
          return (
            <FellowshipCoreMemberCard key={member.address} member={member} />
          );
        })}
      </div>
    </FellowshipCoreCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipParams = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(fellowshipMembersApiUri),
    ssrNextApi.fetch(fellowshipParamsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
      fellowshipParams,
    },
  };
});
