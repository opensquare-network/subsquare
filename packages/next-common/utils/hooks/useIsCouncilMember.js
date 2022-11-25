import React from "react";
import { isSameAddress } from "..";
import { useUser } from "../../context/user";
import useCouncilMembers from "./useCouncilMembers";

export default function useIsCouncilMember() {
  const loginUser = useUser();
  const councilTippers = useCouncilMembers();
  const userIsTipper = councilTippers?.some((address) =>
    isSameAddress(loginUser?.address, address)
  );

  return userIsTipper;
}
