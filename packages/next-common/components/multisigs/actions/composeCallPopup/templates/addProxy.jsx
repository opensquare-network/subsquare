import { AddProxyFields } from "next-common/components/myProxies/operations/popup/addProxy";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import { useStepContainer } from "next-common/context/stepContainer";
import MultisigPopupWrapper from "../multisigPopupWraper";

export default function AddProxy() {
  const { goBack } = useStepContainer();
  return (
    <MultisigPopupWrapper>
      <AddProxyFields previousButton={<PreviousButton onClick={goBack} />} />
    </MultisigPopupWrapper>
  );
}
