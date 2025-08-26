import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useIdentityOf } from "next-common/hooks/identity/useIdentityOf";
import { usePeopleApi } from "next-common/context/people/api";
import IdentityPropList from "next-common/components/people/overview/identity/identityPropList";

export default function DirectIdentity() {
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { info, judgements, isLoading } = useIdentityOf(api, address);

  console.log(judgements);

  return (
    <IdentityPropList
      className="ml-0"
      identityInfo={info}
      isLoading={isLoading}
    />
  );
}
