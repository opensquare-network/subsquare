import GreyInfoPanel from "../styled/greyInfoPanel";
import { Count } from "./styled";

export default function AllBeenDelegatedInfo({ beenDelegatedList }) {
  if (!beenDelegatedList?.length) {
    return null;
  }

  return (
    <GreyInfoPanel className="!rounded">
      Been delegated <Count>{beenDelegatedList.length}</Count>
    </GreyInfoPanel>
  );
}
