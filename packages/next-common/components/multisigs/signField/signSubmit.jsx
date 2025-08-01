import { SystemSignature } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import Tooltip from "next-common/components/tooltip";
import { useSignSubmitPopup } from "../context/signSubmitPopupContext";

export default function SignSubmit({ multisig = {} }) {
  const { setVisible, setCurrentMultisig } = useSignSubmitPopup();

  const handleClick = () => {
    setVisible(true);
    setCurrentMultisig(multisig);
  };

  return (
    <Tooltip content="Approve">
      <Wrapper onClick={handleClick}>
        <SystemSignature role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
