import { noop } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import useFellowshipMembersUpdateFunc from "next-common/components/fellowship/core/updateFunc";
import PopupLabel from "next-common/components/popup/label";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import AddressUser from "next-common/components/user/addressUser";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

export default function ActivationPopup(props) {
  const { who, onClose = noop } = props || {};

  const { component } = useSigner();

  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx.fellowshipCore.setActive(who);
    }
  }, [api, who]);

  const onInBlock = useFellowshipMembersUpdateFunc();

  return (
    <PopupWithSigner title="Activation" {...props}>
      {component}
      <div>
        <PopupLabel text="Who" />
        <GreyPanel className="px-3 py-4 gap-4">
          <AddressUser add={who} fontSize={14} />
        </GreyPanel>
      </div>
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </PopupWithSigner>
  );
}
