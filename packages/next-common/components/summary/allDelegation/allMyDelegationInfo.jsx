import GreyInfoPanel from "../styled/greyInfoPanel";
import { Count } from "./styled";

export default function AllMyDelegationInfo({ delegations }) {
  if (!delegations?.length) {
    return null;
  }

  return (
    <GreyInfoPanel className="!rounded">
      My delegation <Count>{delegations.length}</Count>
    </GreyInfoPanel>
  );
}
