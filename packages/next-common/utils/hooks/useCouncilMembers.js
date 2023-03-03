import useApi from "./useApi";
import useCall from "./useCall";

export default function useCouncilMembers() {
  const api = useApi();
  const councilMembers = useCall(
    (api?.query.council || api?.query.generalCouncil)?.members,
    [],
  );
  return councilMembers?.toJSON() || [];
}
