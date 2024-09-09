import MembersList from "next-common/components/membersList/simpleMembersList";
import useCouncilMembers from "next-common/utils/hooks/useCouncilMembers";
import usePrime from "next-common/utils/hooks/usePrime";

export default function MembersNoElections({ category }) {
  const members = useCouncilMembers();
  const prime = usePrime();

  return (
    <MembersList
      prime={prime}
      category={category}
      items={members || []}
      loading={!members}
    />
  );
}
