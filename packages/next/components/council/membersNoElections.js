import MembersList from "next-common/components/membersList/simpleMembersList";
import usePrime from "next-common/utils/hooks/usePrime";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";

export default function MembersNoElections({ category }) {
  const api = useContextApi();
  const pallet = useCollectivePallet();
  const { value: members, loading: loadingMembers } = useCall(
    api?.query[pallet]?.members,
    [],
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
