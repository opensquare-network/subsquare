import useApi from "./useApi";
import useCall from "./useCall";
import useCouncilName from "../../hooks/useCouncilName";

export default function useCouncilMembers() {
  const api = useApi();
  const councilName = useCouncilName();
  const councilMembers = useCall(
    (api?.query[councilName])?.members,
    [],
  );

  return councilMembers?.toJSON();
}
