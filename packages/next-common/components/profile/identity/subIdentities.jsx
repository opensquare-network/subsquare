import useSubIdentities from "next-common/hooks/identity/useSubIdentities";
import { usePeopleApi } from "next-common/context/people/api";
import { SubIdentitiesTableImpl } from "next-common/components/people/subTable";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function SubIdentities() {
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { subs, isLoading } = useSubIdentities(api, address);
  return <SubIdentitiesTableImpl subs={subs} isLoading={isLoading} />;
}
