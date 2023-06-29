import MembersList from "next-common/components/membersList/simpleMembersList";
import usePrime from "next-common/utils/hooks/usePrime";
import useCouncilName from "next-common/hooks/useCouncilName";
import useCall from "next-common/utils/hooks/useCall";
import useApi from "next-common/utils/hooks/useApi";

export default function Members({ category, type }) {
  const api = useApi();
  const councilName = useCouncilName(type);
  const [members, loadingMembers] = useCall(
    api?.query[councilName]?.members,
    []
  );
  const prime = usePrime();

  const data = members?.toJSON() || [];

  return (
    <MembersList
      prime={prime}
      category={category}
      items={data}
      loading={loadingMembers}
    />
  );
}
