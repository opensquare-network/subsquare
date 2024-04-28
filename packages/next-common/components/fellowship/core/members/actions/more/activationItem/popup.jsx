import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useSigner from "next-common/components/common/tx/useSigner";
import useFellowshipMembersUpdateFunc from "next-common/components/fellowship/core/updateFunc";
import PopupLabel from "next-common/components/popup/label";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import AddressUser from "next-common/components/user/addressUser";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

function Content() {
  const { onClose, who, member } = usePopupParams();
  const { component } = useSigner("Origin");
  const { isActive } = member.status;
  const targetActiveValue = !isActive;

  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api && who) {
      return api.tx.fellowshipCore.setActive(targetActiveValue);
    }
  }, [api, who]);

  const onInBlock = useFellowshipMembersUpdateFunc();

  return (
    <>
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
    </>
  );
}

export default function ActivationPopup(props) {
  return (
    <PopupWithSigner title="Activation" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
