import { isSameAddress } from "..";
import { useUser } from "../../context/user";
import useCouncilMembers from "./useCouncilMembers";

export default function useIsCouncilMember() {
  const loginUser = useUser();
  const councilTippers = useCouncilMembers();
  return councilTippers?.some((address) =>
    isSameAddress(loginUser?.address, address)
  );
}
