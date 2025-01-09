import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";

function Content() {
  const { who, member } = usePopupParams();
  const { component } = useSigner("Origin");
  const { isActive } = member.status;
  const targetActiveValue = !isActive;
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();

  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx[pallet].setActive(targetActiveValue);
    }
  }, [api, pallet, who, targetActiveValue]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  return (
    <>
      {component}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function ActivationPopup(props) {
  return (
    <PopupWithSigner title="Activation" {...props}  className="max-h-[640px]">
      <Content />
    </PopupWithSigner>
  );
}
