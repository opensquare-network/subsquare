import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useIdentityOf } from "next-common/hooks/people/useSubMyIdentityInfo";
import { usePeopleApi } from "next-common/context/people/api";

export default function DirectIdentity() {
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { info, judgements, isLoading } = useIdentityOf(api, address);
  console.log(api, info, judgements, isLoading, address);

  return <div>DirectIdentity</div>;
}
