import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";

function Content() {
  const { who } = usePopupParams();
  const api = useContextApi();
  const pallet = useCoreFellowshipPallet();

  // TODO
  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx[pallet].bump(who);
    }
  }, [api, pallet, who]);

  const onInBlock = useCoreFellowshipUpdateFunc();

  return (
    <>
      <div>can be demoted members table</div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function BatchBumpPopup(props) {
  return (
    <PopupWithSigner title="Bump Members" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
