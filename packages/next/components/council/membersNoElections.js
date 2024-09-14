import MembersList from "next-common/components/membersList/simpleMembersList";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import usePrime from "next-common/utils/hooks/usePrime";

export default function MembersNoElections({ category }) {
  const { members } = useCollectiveMembers();
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
