import useCall from "./useCall";
import useCouncilName from "../../hooks/useCouncilName";
import { useContextApi } from "next-common/context/api";

export default function useCouncilMembers() {
  const api = useContextApi();
  const councilName = useCouncilName();
  const [councilMembers] = useCall(api?.query[councilName]?.members, []);

  return councilMembers?.toJSON();
}
