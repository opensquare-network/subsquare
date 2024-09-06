import useCouncilName from "../../hooks/useCouncilName";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useCouncilMembers(type) {
  const councilName = useCouncilName(type);
  const { result } = useSubStorage(councilName, "members");

  return result?.toJSON();
}
